import { Flame, Sparkles, Utensils } from 'lucide-react'
import { processo } from '../data/site'
import { Img, Reveal } from './ui'

const icones = [Utensils, Flame, Sparkles]

export function Processo() {
  return (
    <section id="processo" className="relative border-y border-line bg-coal">
      <div className="grain absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Como fazemos</span>
          <h2 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bone">
            Três coisas que
            <span className="accent-serif mx-3 text-fire normal-case">não</span>
            negociamos
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {processo.map((p, i) => {
            const Icone = icones[i]
            return (
              <Reveal key={p.n} delay={i * 0.1}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink/60 p-7 transition-colors duration-500 hover:border-gold/35">
                  <span className="display absolute -top-3 right-4 text-[5.5rem] leading-none text-bone/4 transition-colors duration-500 group-hover:text-gold/10">
                    {p.n}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Icone className="h-5.5 w-5.5" strokeWidth={1.8} />
                  </span>
                  <h3 className="display mt-6 text-2xl text-bone">{p.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{p.texto}</p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-line">
            <Img
              src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1800&q=76"
              alt="Chapa quente com burgers selando"
              className="h-56 w-full sm:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-7 sm:p-12">
              <p className="accent-serif text-2xl leading-snug text-bone sm:text-3xl">
                “Se a carne não chiar na chapa, não sai da cozinha.”
              </p>
              <span className="mt-4 text-xs tracking-[0.18em] text-gold uppercase">
                Seu Nilton · fundador
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
