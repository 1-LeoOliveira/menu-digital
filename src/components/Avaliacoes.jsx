import { depoimentos } from '../data/site'
import { Reveal, Stars } from './ui'

export function Avaliacoes() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="eyebrow">Quem já comeu</span>
            <h2 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bone">
              2.418 avaliações,
              <span className="accent-serif ml-3 text-fire normal-case">nota 4,9</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 px-5 py-4">
            <span className="display text-4xl text-fire">4,9</span>
            <div>
              <Stars />
              <p className="mt-1 text-xs text-ash">média nas três unidades</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {depoimentos.map((d, i) => (
            <Reveal key={d.nome} delay={i * 0.07}>
              <figure className="card flex h-full flex-col p-6">
                <Stars n={d.nota} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-bone/85">
                  “{d.texto}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-xs font-bold text-ink">
                    {d.nome
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-bone">{d.nome}</span>
                    <span className="text-[0.7rem] tracking-wide text-ash uppercase">
                      {d.local}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
