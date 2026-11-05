import { ArrowRight, Bike, Clock, CreditCard, ShoppingBag } from 'lucide-react'
import { site, unidades } from '../data/site'
import { Img, Reveal } from './ui'
import { Logo } from './Logo'

const anoAtual = new Date().getFullYear()

function IconeInstagram({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ChamadaFinal({ onPedir }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Img
          src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1900&q=76"
          alt="Hambúrguer duplo da casa"
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-ink/82" />
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-36">
        <Reveal>
          <span className="eyebrow">Está com fome agora?</span>
          <h2 className="display mt-5 text-[clamp(2.6rem,8vw,6rem)] text-bone">
            Pede e deixa
            <br />
            <span className="accent-serif text-fire normal-case">a gente cuidar do resto</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-ash">
            Menu digital completo, pedido em menos de um minuto e confirmação direto no WhatsApp.
            Entrega em {site.entrega.tempoMin}–{site.entrega.tempoMax} minutos.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={onPedir} className="btn btn-primary group px-8 py-4 text-base">
              <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
              Abrir menu digital
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost px-8 py-4 text-base"
            >
              <IconeInstagram className="h-4.5 w-4.5" />
              {site.instagramHandle}
            </a>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-ash">
            <li className="flex items-center gap-2">
              <Bike className="h-4 w-4 text-gold" /> entrega própria
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> {site.entrega.tempoMin}–
              {site.entrega.tempoMax} min
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gold" /> {site.pagamentos.join(' · ')}
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function Rodape() {
  return (
    <footer className="border-t border-line bg-ink px-5 pt-16 pb-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <span>
                <span className="display block text-xl text-bone">{site.nome}</span>
                <span className="text-[0.62rem] tracking-[0.2em] text-ash uppercase">
                  {site.tagline} · desde {site.desde}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
              Hamburgueria artesanal na {site.cidade}. Carne moída na hora, chapa de ferro e nada
              de congelado — do jeito que sempre foi.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-bone transition-colors hover:text-gold"
            >
              <IconeInstagram className="h-4.5 w-4.5" />
              {site.instagramHandle}
            </a>
          </div>

          <div>
            <h3 className="text-[0.68rem] tracking-[0.2em] text-gold uppercase">Unidades</h3>
            <ul className="mt-5 space-y-4 text-sm text-ash">
              {unidades.map((u) => (
                <li key={u.id}>
                  <span className="block font-semibold text-bone">{u.nome}</span>
                  {u.endereco}
                  <br />
                  <span className="text-ash/70">{u.horario}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.68rem] tracking-[0.2em] text-gold uppercase">Navegação</h3>
            <ul className="mt-5 space-y-3 text-sm text-ash">
              {[
                ['#historia', 'Nossa história'],
                ['#cardapio', 'Destaques'],
                ['#processo', 'Como fazemos'],
                ['#unidades', 'Unidades'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-bone">
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
              Pagamentos
            </h3>
            <p className="mt-4 text-sm text-ash">{site.pagamentos.join(' · ')}</p>
          </div>
        </div>

        <div className="hairline mt-14" />

        <div className="mt-6 flex flex-col gap-2 text-xs text-ash/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anoAtual} {site.nome}. Todos os direitos reservados.
          </p>
          <p>CNPJ 00.000.000/0001-00 · Feito com fogo em Santa Catarina</p>
        </div>
      </div>
    </footer>
  )
}
