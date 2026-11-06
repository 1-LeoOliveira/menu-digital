import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { opcoesPorId, proporcao } from '../../data/builder'

// ============================================================
//  A PILHA — monta o lanche com os recortes de public/ingredientes/.
//
//  Como cada camada é posicionada:
//    largura da foto = opt.largura% da largura da pilha
//    altura  da foto = largura * proporção do recorte
//    "degrau" (o quanto a camada levanta a pilha) = altura * opt.fatia
//
//  O que sobra da foto transborda para baixo e cobre a camada de baixo —
//  é isso que dá o encaixe de lanche de verdade. Cada ingrediente novo
//  cai de cima, amassa um pouco ao bater e empurra o pão para o alto.
// ============================================================

function medidas(opt, largura, base = false) {
  const src = base ? (opt.imgBase ?? opt.img) : opt.img
  const w = (opt.largura / 100) * largura
  const h = w * proporcao(src)
  const fatia = base ? (opt.fatiaBase ?? opt.fatia) : opt.fatia
  return { src, w, h, degrau: Math.max(4, h * fatia), espelhar: base && opt.espelharBase }
}

/** Altura total que o lanche ocupa, em px. */
export function alturaDaPilha(pao, camadas, largura) {
  const base = medidas(pao, largura, true)
  let total = medidas(pao, largura).degrau + base.h
  for (const c of camadas) {
    const opt = opcoesPorId.get(c.optId)
    if (opt) total += medidas(opt, largura).degrau
  }
  return total
}

/** Uma camada: a foto recortada, com barra colorida de reserva se ela falhar. */
function Foto({ m, cor, alt }) {
  const [erro, setErro] = useState(false)

  if (erro) {
    return (
      <span
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: m.w,
          height: Math.max(8, m.degrau * 1.4),
          background: `linear-gradient(180deg, ${cor}, color-mix(in srgb, ${cor} 55%, #000))`,
          boxShadow: '0 4px 10px -6px rgba(0,0,0,.9)',
        }}
      />
    )
  }

  return (
    <img
      src={m.src}
      alt={alt}
      width={Math.round(m.w)}
      height={Math.round(m.h)}
      draggable={false}
      decoding="async"
      onError={() => setErro(true)}
      className="pointer-events-none absolute top-0 left-1/2 max-w-none select-none"
      style={{
        width: m.w,
        height: m.h,
        transform: `translateX(-50%)${m.espelhar ? ' scaleY(-1)' : ''}`,
        filter: 'drop-shadow(0 5px 7px rgba(0,0,0,.45))',
      }}
    />
  )
}

export function PilhaLanche({
  pao,
  camadas,
  largura = 216,
  alturaMax = 300,
  onRemover,
  className = '',
  glow = true,
}) {
  const reduzirMovimento = useReducedMotion()

  const itens = camadas
    .map((c) => ({ ...c, opt: opcoesPorId.get(c.optId) }))
    .filter((c) => c.opt)

  const mTopo = medidas(pao, largura)
  const mBase = medidas(pao, largura, true)
  const total =
    mTopo.degrau +
    mBase.h +
    itens.reduce((s, c) => s + medidas(c.opt, largura).degrau, 0)

  const escala = Math.min(1, (alturaMax - 10) / total)
  const deCimaParaBaixo = [...itens].reverse()
  const zTopo = deCimaParaBaixo.length + 2

  const mola = { type: 'spring', damping: 24, stiffness: 320 }

  return (
    <div
      className={`relative flex items-end justify-center overflow-hidden ${className}`}
      style={{ minHeight: alturaMax }}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 left-1/2 h-3 -translate-x-1/2 rounded-[50%] bg-black/55 blur-md"
        style={{ width: largura * 0.74 * escala }}
      />

      <div
        className="relative"
        style={{
          width: largura,
          transform: `scale(${escala})`,
          transformOrigin: 'bottom center',
          transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* pão de cima */}
        <motion.div
          layout="position"
          transition={mola}
          className="relative"
          style={{ height: mTopo.degrau, zIndex: zTopo }}
        >
          <Foto m={mTopo} cor={pao.cor} alt="" />
        </motion.div>

        {/* recheio — o último escolhido fica logo abaixo do pão */}
        <AnimatePresence initial={false} mode="popLayout">
          {deCimaParaBaixo.map((c, i) => {
            const m = medidas(c.opt, largura)
            return (
              <motion.div
                key={c.uid}
                layout="position"
                initial={
                  reduzirMovimento
                    ? { opacity: 0 }
                    : { opacity: 0, y: -(largura * 0.75), scale: 1.08, rotate: -5 }
                }
                animate={
                  reduzirMovimento
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, scale: 1, rotate: 0, scaleY: [1.1, 0.86, 1.05, 0.98, 1] }
                }
                exit={
                  reduzirMovimento
                    ? { opacity: 0 }
                    : { opacity: 0, x: largura * 0.42, y: 12, rotate: 14, scale: 0.9 }
                }
                transition={
                  reduzirMovimento
                    ? { duration: 0.2 }
                    : {
                        default: { type: 'spring', damping: 15, stiffness: 460, mass: 0.9 },
                        scaleY: { duration: 0.52, times: [0, 0.42, 0.62, 0.82, 1], ease: 'easeOut' },
                        opacity: { duration: 0.14 },
                      }
                }
                className="relative"
                style={{ height: m.degrau, zIndex: zTopo - 1 - i, originY: 1 }}
              >
                {onRemover ? (
                  <button
                    type="button"
                    onClick={() => onRemover(c.uid)}
                    title={`Tirar ${c.opt.nome}`}
                    aria-label={`Tirar ${c.opt.nome} do lanche`}
                    className="absolute inset-x-0 top-0 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    style={{ height: m.h }}
                  >
                    <Foto m={m} cor={c.opt.cor} alt="" />
                  </button>
                ) : (
                  <Foto m={m} cor={c.opt.cor} alt="" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* pão de baixo */}
        <motion.div
          layout="position"
          transition={mola}
          className="relative"
          style={{ height: mBase.degrau, zIndex: 1 }}
        >
          <Foto m={mBase} cor={pao.cor} alt="" />
        </motion.div>

        {/* barriga do pão de baixo, que transborda para fora da caixa */}
        <div aria-hidden style={{ height: mBase.h - mBase.degrau }} />
      </div>
    </div>
  )
}
