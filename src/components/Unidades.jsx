import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'
import { unidades } from '../data/site'
import { Img, Reveal } from './ui'

export function Unidades() {
  return (
    <section id="unidades" className="border-t border-line bg-coal px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Onde nos encontrar</span>
          <h2 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bone">
            Três casas na
            <span className="accent-serif ml-3 text-fire normal-case">Grande Florianópolis</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {unidades.map((u, i) => (
            <Reveal key={u.id} delay={i * 0.09}>
              <article className="card group flex h-full flex-col">
                <div className="relative h-44 overflow-hidden">
                  <Img
                    src={u.img}
                    alt={`Unidade ${u.nome}`}
                    className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/30 to-transparent" />
                  <h3 className="display absolute bottom-3 left-5 text-3xl text-bone">{u.nome}</h3>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.7rem] tracking-[0.16em] text-gold uppercase">
                    {u.destaque}
                  </p>

                  <ul className="mt-5 space-y-3 text-sm text-ash">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ash/70" />
                      <span>
                        {u.endereco}
                        <br />
                        {u.cidade} · SC
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ash/70" />
                      {u.horario}
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ash/70" />
                      <a href={`tel:${u.telefone.replace(/\D/g, '')}`} className="hover:text-bone">
                        {u.telefone}
                      </a>
                    </li>
                  </ul>

                  <a
                    href={u.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn mt-6 flex items-center gap-2 border-t border-line pt-4 text-sm font-semibold text-bone transition-colors hover:text-gold"
                  >
                    Traçar rota
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
