// ============================================================
//  RECORTE DOS INGREDIENTES
//
//  Pega as fotos originais (fundo branco) em fotos-originais/ingredientes/,
//  tira o fundo e a sombra, joga fora pedaços soltos de outros ingredientes
//  que aparecem na mesma foto, corta no limite do objeto, redimensiona e
//  salva PNG com transparência em public/ingredientes/.
//
//  Também gera src/data/medidas-ingredientes.js com o tamanho de cada recorte —
//  a pilha usa essa proporção para calcular a altura de cada camada.
//
//      npm run ingredientes
//
//  Fotos novas: jogue o .jpg em fotos-originais/ingredientes/ e rode de novo.
// ============================================================

import { readdir, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRADA = path.join(raiz, 'fotos-originais', 'ingredientes')
const SAIDA = path.join(raiz, 'public', 'ingredientes')
const MEDIDAS = path.join(raiz, 'src', 'data', 'medidas-ingredientes.js')

const LARGURA_FINAL = 440 // px do PNG final (a pilha mostra ~220px)

// Quanto "quase branco" ainda conta como fundo. O padrão é conservador para
// não comer ingrediente claro (clara de ovo, mussarela, maionese).
//
// Se sobrar mancha clara do prato em alguma foto — reflexo entre as rodelas,
// brilho embaixo da fatia — afrouxe a tolerância dela aqui e rode de novo.
const PADRAO = { fundoMin: 236, fundoTol: 16, sombraMin: 183, sombraTol: 20 }

const AJUSTES = {
  tomate: { fundoTol: 40, sombraMin: 170, sombraTol: 34 },
  bacon: { fundoTol: 38, sombraMin: 172, sombraTol: 32 },
  picles: { fundoTol: 34, sombraMin: 176, sombraTol: 28 },
  abacate: { fundoTol: 32, sombraMin: 178, sombraTol: 26 },
  frango_grelhado: { fundoTol: 34, sombraMin: 176, sombraTol: 28 },
  crispy_onion: { fundoTol: 30, sombraMin: 180, sombraTol: 24 },
  cebola_roxa: { fundoTol: 34, sombraMin: 176, sombraTol: 28 },
  jalapeno: { fundoTol: 34, sombraMin: 176, sombraTol: 28 },
  alface: { fundoTol: 30, sombraMin: 180, sombraTol: 24 },
}

const limites = (slug) => ({ ...PADRAO, ...(AJUSTES[slug] ?? {}) })

/** Marca como fundo tudo que se alcança a partir da borda. */
function inundar(data, w, h, aceita, marcado) {
  const fila = new Int32Array(w * h)
  let inicio = 0
  let fim = 0

  const tentar = (i) => {
    if (marcado[i]) return
    const p = i * 3
    if (!aceita(data[p], data[p + 1], data[p + 2])) return
    marcado[i] = 1
    fila[fim++] = i
  }

  for (let x = 0; x < w; x++) {
    tentar(x)
    tentar((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    tentar(y * w)
    tentar(y * w + w - 1)
  }

  while (inicio < fim) {
    const i = fila[inicio++]
    const x = i % w
    const y = (i / w) | 0
    if (x > 0) tentar(i - 1)
    if (x < w - 1) tentar(i + 1)
    if (y > 0) tentar(i - w)
    if (y < h - 1) tentar(i + w)
  }
}

/** Continua a inundação já marcada, agora aceitando sombra. */
function inundarSombra(data, w, h, marcado, ehSombra) {
  const fila = new Int32Array(w * h)
  let inicio = 0
  let fim = 0
  for (let i = 0; i < w * h; i++) if (marcado[i]) fila[fim++] = i

  const tentar = (i) => {
    if (marcado[i]) return
    const p = i * 3
    if (!ehSombra(data[p], data[p + 1], data[p + 2])) return
    marcado[i] = 1
    fila[fim++] = i
  }

  while (inicio < fim) {
    const i = fila[inicio++]
    const x = i % w
    const y = (i / w) | 0
    if (x > 0) tentar(i - 1)
    if (x < w - 1) tentar(i + 1)
    if (y > 0) tentar(i - w)
    if (y < h - 1) tentar(i + w)
  }
}

/** Mantém só os pedaços grandes: descarta fragmentos de outros ingredientes. */
function limparPedacos(solido, w, h, minimoRelativo = 0.2) {
  const rotulo = new Int32Array(w * h).fill(-1)
  const areas = []
  const fila = new Int32Array(w * h)

  for (let i = 0; i < w * h; i++) {
    if (!solido[i] || rotulo[i] !== -1) continue
    const id = areas.length
    let inicio = 0
    let fim = 0
    fila[fim++] = i
    rotulo[i] = id
    let area = 0

    while (inicio < fim) {
      const j = fila[inicio++]
      area++
      const x = j % w
      const y = (j / w) | 0
      const vizinhos = [
        x > 0 ? j - 1 : -1,
        x < w - 1 ? j + 1 : -1,
        y > 0 ? j - w : -1,
        y < h - 1 ? j + w : -1,
      ]
      for (const v of vizinhos) {
        if (v >= 0 && solido[v] && rotulo[v] === -1) {
          rotulo[v] = id
          fila[fim++] = v
        }
      }
    }
    areas.push(area)
  }

  if (!areas.length) return { descartados: 0 }
  const maior = Math.max(...areas)
  const corte = maior * minimoRelativo
  let descartados = 0

  for (let i = 0; i < w * h; i++) {
    const id = rotulo[i]
    if (id !== -1 && areas[id] < corte) {
      solido[i] = 0
      descartados++
    }
  }
  return { descartados, pedacos: areas.length }
}

async function recortar(arquivo) {
  const slug = path.basename(arquivo, path.extname(arquivo)).toLowerCase()
  const lim = limites(slug)

  const ehFundo = (r, g, b) => {
    const max = Math.max(r, g, b)
    return max >= lim.fundoMin && max - Math.min(r, g, b) <= lim.fundoTol
  }

  const ehSombra = (r, g, b) => {
    const max = Math.max(r, g, b)
    return max >= lim.sombraMin && max - Math.min(r, g, b) <= lim.sombraTol
  }

  const origem = path.join(ENTRADA, arquivo)
  const { data, info } = await sharp(origem)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: w, height: h } = info
  const fundo = new Uint8Array(w * h)

  inundar(data, w, h, ehFundo, fundo)
  inundarSombra(data, w, h, fundo, ehSombra)

  const solido = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) solido[i] = fundo[i] ? 0 : 1

  const { descartados } = limparPedacos(solido, w, h)

  // encolhe a silhueta 2px: é o que tira a franja branca que a foto deixa na borda
  const alfa = Buffer.alloc(w * h)
  let camadaAtual = solido
  for (let passo = 0; passo < 2; passo++) {
    const proxima = new Uint8Array(w * h)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        if (!camadaAtual[i]) continue
        const borda =
          x === 0 ||
          y === 0 ||
          x === w - 1 ||
          y === h - 1 ||
          !camadaAtual[i - 1] ||
          !camadaAtual[i + 1] ||
          !camadaAtual[i - w] ||
          !camadaAtual[i + w]
        proxima[i] = borda ? 0 : 1
      }
    }
    camadaAtual = proxima
  }
  for (let i = 0; i < w * h; i++) alfa[i] = camadaAtual[i] ? 255 : 0

  // limites do que sobrou
  let x0 = w
  let y0 = h
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!alfa[y * w + x]) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x1 < 0) throw new Error(`${arquivo}: não sobrou nada depois de tirar o fundo`)

  // suaviza a borda do recorte (o joinChannel do sharp bagunça as dimensões
  // quando a entrada é raw, então o RGBA é montado na mão)
  const { data: alfaSuave, info: infoAlfa } = await sharp(alfa, {
    raw: { width: w, height: h, channels: 1 },
  })
    .blur(1.1)
    .raw()
    .toBuffer({ resolveWithObject: true })

  // o blur pode devolver 1 ou 3 canais dependendo da versão do sharp
  const passo = infoAlfa.channels

  const rgba = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = data[i * 3]
    rgba[i * 4 + 1] = data[i * 3 + 1]
    rgba[i * 4 + 2] = data[i * 3 + 2]
    rgba[i * 4 + 3] = alfaSuave[i * passo]
  }

  const recorte = {
    left: x0,
    top: y0,
    width: x1 - x0 + 1,
    height: y1 - y0 + 1,
  }

  const png = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract(recorte)
    .resize({ width: LARGURA_FINAL, withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 92, effort: 6 })
    .toBuffer()

  const destino = path.join(SAIDA, `${slug}.webp`)
  await writeFile(destino, png)

  const meta = await sharp(png).metadata()
  return {
    slug,
    largura: meta.width,
    altura: meta.height,
    kb: Math.round(png.length / 1024),
    descartados,
  }
}

/** Metade de baixo do pão: a mesma foto espelhada e achatada. */
async function gerarBaseDoPao(slug, achatamento = 0.62) {
  const origem = path.join(SAIDA, `${slug}.webp`)
  const meta = await sharp(origem).metadata()
  const altura = Math.max(8, Math.round(meta.height * achatamento))

  const png = await sharp(origem)
    .flip()
    .resize({ width: meta.width, height: altura, fit: 'fill' })
    .webp({ quality: 86, alphaQuality: 92, effort: 6 })
    .toBuffer()

  const destino = path.join(SAIDA, `${slug}_base.webp`)
  await writeFile(destino, png)
  return { slug: `${slug}_base`, largura: meta.width, altura, kb: Math.round(png.length / 1024) }
}

async function main() {
  await mkdir(SAIDA, { recursive: true })
  const arquivos = (await readdir(ENTRADA)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()

  const manifesto = {}
  for (const arquivo of arquivos) {
    const r = await recortar(arquivo)
    manifesto[r.slug] = { w: r.largura, h: r.altura }
    console.log(
      `${r.slug.padEnd(24)} ${String(r.largura).padStart(4)}x${String(r.altura).padEnd(4)} ${String(r.kb).padStart(3)}kb${r.descartados > 2000 ? '  (pedaço solto descartado)' : ''}`,
    )
  }

  for (const slug of Object.keys(manifesto).filter((s) => s.startsWith('pao_'))) {
    const r = await gerarBaseDoPao(slug)
    manifesto[r.slug] = { w: r.largura, h: r.altura }
    console.log(`${r.slug.padEnd(24)} ${String(r.largura).padStart(4)}x${String(r.altura).padEnd(4)} ${String(r.kb).padStart(3)}kb  (metade de baixo)`)
  }

  const cabecalho =
    '// GERADO POR scripts/recortar-ingredientes.mjs — não edite na mão.\n' +
    '// Tamanho de cada recorte; a pilha usa a proporção para calcular a altura da camada.\n\n'
  await writeFile(MEDIDAS, `${cabecalho}export const medidas = ${JSON.stringify(manifesto, null, 2)}\n`)
  console.log(`\n${Object.keys(manifesto).length} recortes em public/ingredientes/`)
}

main()
