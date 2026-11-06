import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bike, Clock, Plus, Search, ShoppingBag, Sparkles, Store, X } from 'lucide-react'
import { brl, categorias, itens, tagInfo } from '../../data/menu'
import { opcoesPorId, previewBanner } from '../../data/builder'
import { site } from '../../data/site'
import { useCart } from '../../store/cart'
import { Img, useEscape, useScrollLock } from '../ui'
import { Logo } from '../Logo'
import { ItemSheet } from './ItemSheet'
import { MonteSeuLanche } from './MonteSeuLanche'
import { PilhaLanche } from './PilhaLanche'
import { Sacola } from './Sacola'

// lanche estático do banner "Monte seu lanche"
const paoPreview = opcoesPorId.get(previewBanner.pao)
const camadasPreview = previewBanner.camadas.map((optId, i) => ({ uid: `pv${i}`, optId }))

const normalizar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function MenuDigital({ aberto, onClose }) {
  const { quantidade, subtotal, qtdDoItem } = useCart()
  const [busca, setBusca] = useState('')
  const [catAtiva, setCatAtiva] = useState('destaques')
  const [itemAberto, setItemAberto] = useState(null)
  const [sacolaAberta, setSacolaAberta] = useState(false)
  const [montarAberto, setMontarAberto] = useState(false)
  const [modo, setModo] = useState('entrega')

  const scrollRef = useRef(null)
  const secoesRef = useRef({})

  useScrollLock(aberto)
  useEscape(aberto && !itemAberto && !sacolaAberta && !montarAberto, onClose)

  useEffect(() => {
    if (!aberto) {
      setBusca('')
      setSacolaAberta(false)
      setItemAberto(null)
      setMontarAberto(false)
    }
  }, [aberto])

  const grupos = useMemo(() => {
    const termo = normalizar(busca.trim())
    const filtrados = termo
      ? itens.filter(
          (i) => normalizar(i.nome).includes(termo) || normalizar(i.desc).includes(termo),
        )
      : itens

    return categorias
      .map((c) => ({
        ...c,
        lista:
          c.id === 'destaques'
            ? filtrados.filter((i) => i.destaque || i.tag === 'mais-pedido')
            : filtrados.filter((i) => i.cat === c.id),
      }))
      .filter((c) => c.lista.length > 0)
  }, [busca])

  // scroll-spy nas categorias
  useEffect(() => {
    if (!aberto) return
    const root = scrollRef.current
    if (!root) return

    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visivel) setCatAtiva(visivel.target.dataset.cat)
      },
      { root, rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    Object.values(secoesRef.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [aberto, grupos])

  const irPara = (id) => {
    const el = secoesRef.current[id]
    const root = scrollRef.current
    if (!el || !root) return
    root.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' })
    setCatAtiva(id)
  }

  return (
    <>
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ink"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Menu digital"
          >
            {/* ---------------- TOPO ---------------- */}
            <header className="shrink-0 border-b border-line bg-coal/90 backdrop-blur-xl">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                <div className="flex items-center gap-3">
                  <Logo className="h-9 w-9 shrink-0" />
                  <span className="leading-none">
                    <span className="display block text-base text-bone sm:text-lg">
                      Menu digital
                    </span>
                    <span className="mt-1 hidden text-[0.6rem] tracking-[0.18em] text-ash uppercase sm:block">
                      {site.nome} · pedido em 1 minuto
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSacolaAberta(true)}
                    className="relative hidden items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-gold/40 sm:flex"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {quantidade > 0 ? brl(subtotal) : 'Sacola'}
                    {quantidade > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-gold to-ember px-1 text-[0.68rem] font-bold text-ink">
                        {quantidade}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    aria-label="Fechar menu digital"
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-bone transition-colors hover:border-bone/40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* busca + modo */}
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-3.5 sm:flex-row sm:items-center sm:px-6">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ash" />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar hambúrguer, porção, bebida…"
                    className="w-full rounded-full border border-line bg-surface/70 py-3 pr-10 pl-11 text-sm text-bone placeholder:text-ash/60 focus:border-gold/50 focus:outline-none"
                  />
                  {busca && (
                    <button
                      onClick={() => setBusca('')}
                      aria-label="Limpar busca"
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-ash hover:text-bone"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface/70 p-1">
                  {[
                    { id: 'entrega', label: 'Entrega', Icone: Bike },
                    { id: 'retirada', label: 'Retirada', Icone: Store },
                  ].map(({ id, label, Icone }) => (
                    <button
                      key={id}
                      onClick={() => setModo(id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:flex-none ${
                        modo === id
                          ? 'bg-gradient-to-br from-gold to-ember text-ink'
                          : 'text-ash hover:text-bone'
                      }`}
                    >
                      <Icone className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* categorias */}
              <div className="no-scrollbar overflow-x-auto border-t border-line/70">
                <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3 sm:px-6">
                  <button
                    onClick={() => setMontarAberto(true)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 to-ember/10 px-4 py-2 text-xs font-semibold whitespace-nowrap text-gold transition-colors hover:border-gold/70"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Monte o seu
                  </button>
                  {grupos.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => irPara(c.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        catAtiva === c.id
                          ? 'border-gold/50 bg-gold/15 text-gold'
                          : 'border-line bg-surface/40 text-ash hover:border-bone/25 hover:text-bone'
                      }`}
                    >
                      <span className="text-[0.7rem] opacity-70">{c.icone}</span>
                      {c.nome}
                      <span className="opacity-50">{c.lista.length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* ---------------- LISTA ---------------- */}
            <div ref={scrollRef} className="thin-scroll relative flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto max-w-6xl px-4 pt-6 pb-36 sm:px-6">
                {!busca && (
                  <button
                    onClick={() => setMontarAberto(true)}
                    className="group relative mb-8 flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-elevated via-coal to-ink p-4 text-left transition-colors duration-500 hover:border-gold/55 sm:gap-7 sm:p-6"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-20 -right-12 h-52 w-52 rounded-full bg-ember/12 blur-3xl"
                    />
                    <span className="relative shrink-0">
                      <PilhaLanche
                        pao={paoPreview}
                        camadas={camadasPreview}
                        alturaMax={132}
                        largura={112}
                        glow={false}
                        className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1.5"
                      />
                    </span>

                    <span className="relative min-w-0 flex-1">
                      <span className="eyebrow flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Novidade
                      </span>
                      <span className="display mt-2 block text-2xl text-bone sm:text-3xl">
                        Monte seu lanche
                      </span>
                      <span className="mt-2 block text-xs leading-relaxed text-ash sm:text-sm">
                        Escolhe o pão, empilha carne, queijo, bacon, salada e molho — e vê o lanche
                        crescer na tela a cada ingrediente.
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-ink transition-transform duration-300 group-hover:scale-110"
                    >
                      <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
                    </span>
                  </button>
                )}

                {grupos.length === 0 && (
                  <div className="py-24 text-center">
                    <span className="text-4xl opacity-40">🔍</span>
                    <h3 className="display mt-4 text-2xl text-bone">Nada encontrado</h3>
                    <p className="mt-2 text-sm text-ash">
                      Não achamos nada para “{busca}”. Tente outro termo.
                    </p>
                    <button onClick={() => setBusca('')} className="btn btn-ghost mt-6">
                      Limpar busca
                    </button>
                  </div>
                )}

                {grupos.map((c) => (
                  <section
                    key={c.id}
                    data-cat={c.id}
                    ref={(el) => (secoesRef.current[c.id] = el)}
                    className="scroll-mt-24 pt-6 pb-2 first:pt-0"
                  >
                    <div className="flex items-center gap-4">
                      <h2 className="display text-2xl text-bone sm:text-3xl">{c.nome}</h2>
                      <span className="hairline flex-1" />
                      <span className="text-xs text-ash">{c.lista.length} itens</span>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                      {c.lista.map((item) => {
                        const noCarrinho = qtdDoItem(item.id)
                        return (
                          <button
                            key={`${c.id}-${item.id}`}
                            onClick={() => setItemAberto(item)}
                            className="group relative flex gap-4 overflow-hidden rounded-2xl border border-line bg-surface/40 p-3 text-left transition-all duration-400 hover:border-gold/35 hover:bg-surface/80"
                          >
                            <div className="relative shrink-0">
                              <Img
                                src={item.img}
                                emoji={item.emoji}
                                alt={item.nome}
                                className="h-26 w-26 rounded-xl sm:h-28 sm:w-28"
                              />
                              {noCarrinho > 0 && (
                                <span className="absolute -top-1.5 -left-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-br from-gold to-ember px-1.5 text-[0.7rem] font-bold text-ink ring-2 ring-ink">
                                  {noCarrinho}
                                </span>
                              )}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-[0.95rem] leading-tight font-bold text-bone">
                                  {item.nome}
                                </h3>
                                {item.tag && (
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase ${tagInfo[item.tag].cor}`}
                                  >
                                    {tagInfo[item.tag].label}
                                  </span>
                                )}
                              </div>

                              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ash">
                                {item.desc}
                              </p>

                              <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
                                <span>
                                  {item.precoDe && (
                                    <span className="mr-2 text-[0.7rem] text-ash/60 line-through">
                                      {brl(item.precoDe)}
                                    </span>
                                  )}
                                  <span className="display text-lg text-bone">
                                    {brl(item.preco)}
                                  </span>
                                  {item.tempo && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-[0.68rem] text-ash">
                                      <Clock className="h-3 w-3" />
                                      {item.tempo}
                                    </span>
                                  )}
                                </span>
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-ink transition-transform duration-300 group-hover:scale-110">
                                  <Plus className="h-4.5 w-4.5" strokeWidth={2.6} />
                                </span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                ))}

                <p className="mt-12 text-center text-xs leading-relaxed text-ash/60">
                  Preços e disponibilidade podem variar por unidade.
                  <br />
                  Entrega em {site.entrega.tempoMin}–{site.entrega.tempoMax} min · frete grátis
                  acima de {brl(site.entrega.minimoGratis)}
                </p>
              </div>
            </div>

            {/* ---------------- BARRA DA SACOLA ---------------- */}
            <AnimatePresence>
              {quantidade > 0 && !sacolaAberta && (
                <motion.div
                  initial={{ y: 90, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 90, opacity: 0 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6"
                >
                  <button
                    onClick={() => setSacolaAberta(true)}
                    className="btn btn-primary pointer-events-auto mx-auto flex w-full max-w-md justify-between px-6 py-4 text-base shadow-2xl"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="grid h-7 min-w-7 place-items-center rounded-full bg-ink/85 px-1.5 text-sm font-bold text-gold">
                        {quantidade}
                      </span>
                      Ver sacola
                    </span>
                    <span className="font-bold">{brl(subtotal)}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <ItemSheet item={itemAberto} onClose={() => setItemAberto(null)} />
      <MonteSeuLanche aberto={montarAberto} onClose={() => setMontarAberto(false)} />
      <Sacola
        aberta={sacolaAberta}
        onClose={() => setSacolaAberta(false)}
        modo={modo}
        setModo={setModo}
      />
    </>
  )
}
