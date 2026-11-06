// ============================================================
//  PRÉVIA DA PILHA (ferramenta de ajuste)
//
//  Monta lanches de exemplo com a MESMA matemática do componente
//  PilhaLanche e salva um JPG, para conferir `largura` e `fatia`
//  de cada ingrediente sem precisar abrir o navegador.
//
//      node scripts/previa-pilha.mjs saida.jpg
// ============================================================

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { opcoesPorId, proporcao, sugestoes } from '../src/data/builder.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const arquivo = (src) => path.join(raiz, 'public', src.replace(/^\//, ''))

const W = 300 // largura de referência da pilha
const CELULA_W = 420
const CELULA_H = 560

/** Mesma conta do componente: devolve as camadas já posicionadas. */
function montar(paoId, camadasIds, largura = W) {
  const pao = opcoesPorId.get(paoId)
  const pecas = []

  const tamanho = (opt, src) => {
    const w = (opt.largura / 100) * largura
    return { w, h: w * proporcao(src) }
  }

  // base do pão
  const srcBase = pao.imgBase ?? pao.img
  const base = tamanho(pao, srcBase)
  const liftBase = base.h * (pao.fatiaBase ?? pao.fatia)
  pecas.push({ src: srcBase, ...base, topo: -liftBase, espelhar: pao.espelharBase })

  let topoPilha = -liftBase

  for (const id of camadasIds) {
    const opt = opcoesPorId.get(id)
    if (!opt) continue
    const t = tamanho(opt, opt.img)
    const lift = t.h * opt.fatia
    topoPilha -= lift
    pecas.push({ src: opt.img, ...t, topo: topoPilha })
  }

  const topoPao = tamanho(pao, pao.img)
  topoPilha -= topoPao.h * pao.fatia
  pecas.push({ src: pao.img, ...topoPao, topo: topoPilha })

  // a barriga do pão de baixo passa da linha do chão
  const barriga = base.h - liftBase
  return { pecas, alturaTotal: -topoPilha + barriga, barriga }
}

async function celula(titulo, paoId, camadas) {
  const { pecas, alturaTotal, barriga } = montar(paoId, camadas)
  const escala = Math.min(1, (CELULA_H - 90) / alturaTotal)

  const fundo = sharp({
    create: { width: CELULA_W, height: CELULA_H, channels: 4, background: '#121010' },
  })

  const chao = CELULA_H - 30 - Math.round(barriga * escala)
  const comps = []
  for (const p of pecas) {
    const w = Math.max(1, Math.round(p.w * escala))
    const h = Math.max(1, Math.round(p.h * escala))
    let img = sharp(arquivo(p.src)).resize({ width: w, height: h, fit: 'fill' })
    if (p.espelhar) img = img.flip()
    comps.push({
      input: await img.png().toBuffer(),
      left: Math.round((CELULA_W - w) / 2),
      top: Math.round(chao + p.topo * escala),
    })
  }

  comps.push({
    input: Buffer.from(
      `<svg width="${CELULA_W}" height="34"><text x="${CELULA_W / 2}" y="22" font-family="sans-serif" font-size="17" fill="#ffb020" text-anchor="middle">${titulo} · ${camadas.length} camadas</text></svg>`,
    ),
    left: 0,
    top: 8,
  })

  return fundo.composite(comps).png().toBuffer()
}

const saida = process.argv[2] ?? 'previa-pilha.jpg'

const casos = [
  ['vazio (só o pão)', 'pao-brioche', []],
  ...sugestoes.map((s) => [s.nome, s.pao, s.camadas]),
  [
    'torre cheia',
    'pao-australiano',
    ['blend-160', 'cheddar', 'blend-160', 'suico', 'bacon', 'ovo-frito', 'crispy-onion', 'alface', 'tomate', 'ketchup'],
  ],
]

const celulas = []
for (const [titulo, pao, camadas] of casos) celulas.push(await celula(titulo, pao, camadas))

const COLS = 3
const linhas = Math.ceil(celulas.length / COLS)
await sharp({
  create: {
    width: COLS * CELULA_W,
    height: linhas * CELULA_H,
    channels: 4,
    background: '#0a0908',
  },
})
  .composite(
    celulas.map((input, i) => ({
      input,
      left: (i % COLS) * CELULA_W,
      top: Math.floor(i / COLS) * CELULA_H,
    })),
  )
  .jpeg({ quality: 90 })
  .toFile(saida)

console.log('ok ->', saida)
