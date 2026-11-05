import { ArrowRight, Clock, Plus } from 'lucide-react'
import { brl, itens, tagInfo } from '../data/menu'
import { Img, Reveal } from './ui'

export function Destaques({ onPedir }) {
  const favoritos = itens.filter((i) => i.destaque).slice(0, 4)

  return (
    <section id="cardapio" className="relative px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="eyebrow">Os mais pedidos</span>
            <h2 className="display mt-4 text-[clamp(2.4rem,6vw,4.6rem)] text-bone">
              Os quatro que
              <span className="accent-serif ml-3 text-fire normal-case">nunca saem</span>
              <br />
              da chapa
            </h2>
          </div>
          <button onClick={onPedir} className="btn btn-ghost group shrink-0">
            Ver cardápio completo
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favoritos.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <article className="card group flex h-full flex-col">
                <div className="relative aspect-5/4 overflow-hidden">
                  <Img
                    src={item.img}
                    emoji={item.emoji}
                    alt={item.nome}
                    className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent opacity-80" />
                  {item.tag && (
                    <span
                      className={`absolute top-3 left-3 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase backdrop-blur-md ${tagInfo[item.tag].cor}`}
                    >
                      {tagInfo[item.tag].label}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="display text-xl text-bone">{item.nome}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">{item.desc}</p>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      {item.precoDe && (
                        <span className="block text-xs text-ash/70 line-through">
                          {brl(item.precoDe)}
                        </span>
                      )}
                      <span className="display text-2xl text-bone">{brl(item.preco)}</span>
                      <span className="mt-1 flex items-center gap-1 text-[0.7rem] text-ash">
                        <Clock className="h-3 w-3" /> {item.tempo}
                      </span>
                    </div>
                    <button
                      onClick={onPedir}
                      aria-label={`Pedir ${item.nome}`}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-ink transition-transform duration-300 hover:scale-110"
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.6} />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
