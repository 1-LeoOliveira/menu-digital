import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Clock, MapPin, ShoppingBag, Star } from 'lucide-react'
import { site } from '../data/site'
import { Img } from './ui'

const stats = [
  { valor: '27', label: 'anos na chapa' },
  { valor: '4,9', label: 'nota no Google' },
  { valor: '+180k', label: 'burgers servidos' },
]

export function Hero({ onPedir }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section id="top" ref={ref} className="grain relative min-h-[100svh] overflow-hidden">
      {/* fundo */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10 h-[116%]">
        <Img
          src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=2000&q=78"
          alt="Hambúrguer artesanal da casa feito na chapa"
          eager
          className="h-full w-full"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_85%_at_82%_18%,transparent_0%,rgba(10,9,8,.55)_42%,#0A0908_78%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/70" />
      <div className="absolute -top-24 -left-24 -z-10 h-120 w-120 rounded-full bg-ember/18 blur-[120px]" />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pt-32 pb-12 sm:px-8 lg:justify-center lg:pb-28">
        <motion.div style={{ opacity: fade }} className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="eyebrow">
              {site.cidade} · desde {site.desde}
            </span>
            <span className="hidden h-px w-10 bg-gold/40 sm:block" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-ash">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              4,9 · 2.418 avaliações
            </span>
          </motion.div>

          <h1 className="display mt-6 text-[clamp(3.2rem,11vw,8.5rem)] text-bone">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              O sabor raiz
            </motion.span>
            <motion.span
              className="accent-serif mt-1 block text-fire text-[clamp(2.1rem,7vw,5.2rem)] leading-[1.05] normal-case"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              que a cidade não esquece
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ash sm:text-lg"
          >
            Carne moída na hora, pão brioche assado no bairro e a mesma chapa de ferro fundido
            desde 1998. Sem pressa, sem congelado, sem atalho.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button onClick={onPedir} className="btn btn-primary group px-7 py-4 text-base">
              <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
              Peça já
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a href="#unidades" className="btn btn-ghost px-7 py-4 text-base">
              <MapPin className="h-4.5 w-4.5" />
              Ver unidades
            </a>
            <span className="mt-1 flex items-center gap-2 text-xs text-ash sm:mt-0 sm:ml-3">
              <Clock className="h-3.5 w-3.5 text-gold" />
              entrega em {site.entrega.tempoMin}–{site.entrega.tempoMax} min
            </span>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line/80 bg-line/70"
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-ink/70 px-4 py-5 backdrop-blur-sm">
                <dt className="display text-3xl text-fire">{s.valor}</dt>
                <dd className="mt-1 text-[0.7rem] leading-tight tracking-wide text-ash uppercase">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="flex h-11 w-6.5 items-start justify-center rounded-full border border-bone/25 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-gold"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
