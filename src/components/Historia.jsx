import { Img, Reveal } from './ui'

const linhaDoTempo = [
  { ano: '1998', texto: 'Seu Nilton abre uma lanchonete de 14 lugares no Centro com uma chapa usada.' },
  { ano: '2006', texto: 'O X-Salada vira obrigação de fim de semana e a fila dobra a esquina.' },
  { ano: '2014', texto: 'Segunda casa em Palhoça. A receita do molho continua escrita à mão.' },
  { ano: '2021', texto: 'Terceira unidade em Santo Amaro e a primeira cozinha própria de defumados.' },
  { ano: 'hoje', texto: 'Três casas, a mesma chapa de 1998 e a segunda geração na cozinha.' },
]

export function Historia() {
  return (
    <section id="historia" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:py-32">
      <div className="absolute top-1/3 -right-40 -z-10 h-120 w-120 rounded-full bg-gold/10 blur-[130px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* colagem */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              <div className="relative col-span-3 overflow-hidden rounded-2xl border border-line">
                <div className="absolute inset-0">
                  <Img
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=75"
                    alt="Salão da casa em noite cheia"
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
                <div className="overflow-hidden rounded-2xl border border-line">
                  <Img
                    src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=75"
                    alt="Fritas rústicas saindo da fritadeira"
                    className="aspect-square w-full"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <Img
                    src="https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=700&q=75"
                    alt="Dois hambúrgueres montados no balcão"
                    className="aspect-square w-full"
                  />
                </div>
              </div>
              <div className="col-span-5 overflow-hidden rounded-2xl border border-line">
                <Img
                  src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=75"
                  alt="Prato da casa servido na mesa"
                  className="aspect-21/9 w-full"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-gold/30 bg-ink/92 px-5 py-4 backdrop-blur-md sm:-left-8">
              <span className="display block text-4xl text-fire">27</span>
              <span className="text-[0.68rem] leading-tight tracking-[0.16em] text-ash uppercase">
                anos
                <br />
                na mesma chapa
              </span>
            </div>
          </div>
        </Reveal>

        {/* texto */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">Nossa história</span>
            <h2 className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-bone">
              Começou com
              <br />
              uma chapa
              <span className="accent-serif ml-3 text-fire normal-case">usada</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ash">
              Em 1998 não existia hamburgueria artesanal na Grande Florianópolis — existia o Seu
              Nilton, catorze banquinhos e uma chapa de ferro comprada de segunda mão. O cardápio
              tinha três itens e um deles virou memória de infância de uma cidade inteira.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ash">
              Hoje são três casas e a segunda geração na cozinha. Mudou a fila, mudou o salão,
              mudou o jeito de pedir. A carne continua sendo moída no fundo da loja, às três da
              tarde, todos os dias.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <ol className="mt-10 space-y-0">
              {linhaDoTempo.map((e) => (
                <li
                  key={e.ano}
                  className="group flex gap-5 border-t border-line py-4 transition-colors last:border-b hover:bg-surface/40"
                >
                  <span className="display w-16 shrink-0 pt-0.5 text-lg text-gold">{e.ano}</span>
                  <span className="text-sm leading-relaxed text-ash transition-colors group-hover:text-bone">
                    {e.texto}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
