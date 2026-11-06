import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Leaf, Minus, Plus, RotateCcw, ShoppingBag, X } from 'lucide-react'
import { brl } from '../../data/menu'
import { builder, grupos, opcoesPorId, paoPadrao, sugestoes } from '../../data/builder'
import { useCart } from '../../store/cart'
import { useEscape } from '../ui'
import { PilhaLanche } from './PilhaLanche'

/** true a partir de lg: define a altura do palco da pilha. */
function useDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return desktop
}

/** Miniatura do ingrediente: a mesma foto que a pilha usa. */
function Miniatura({ opt, className = '' }) {
  return (
    <img
      src={opt.img}
      alt=""
      draggable={false}
      decoding="async"
      loading="lazy"
      className={`shrink-0 object-contain select-none ${className}`}
      style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.5))' }}
    />
  )
}

export function MonteSeuLanche({ aberto, onClose }) {
  const { add } = useCart()
  const desktop = useDesktop()

  const [paoId, setPaoId] = useState(paoPadrao)
  const [camadas, setCamadas] = useState([])
  const [obs, setObs] = useState('')
  const [qtd, setQtd] = useState(1)
  const [aviso, setAviso] = useState('')
  const proximoUid = useRef(0)

  useEscape(aberto, onClose)

  // zera a montagem ao fechar
  useEffect(() => {
    if (aberto) return
    setPaoId(paoPadrao)
    setCamadas([])
    setObs('')
    setQtd(1)
    setAviso('')
  }, [aberto])

  // o aviso de limite desaparece sozinho
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 2600)
    return () => clearTimeout(t)
  }, [aviso])

  const pao = opcoesPorId.get(paoId)

  const novaCamada = useCallback((optId) => {
    proximoUid.current += 1
    return { uid: `c${proximoUid.current}`, optId }
  }, [])

  const contar = useCallback(
    (optId) => camadas.reduce((s, c) => (c.optId === optId ? s + 1 : s), 0),
    [camadas],
  )

  function adicionar(grupo, opt) {
    if (grupo.tipo === 'unico') {
      setPaoId(opt.id)
      return
    }
    if (camadas.length >= builder.maxCamadas) {
      setAviso(`A torre chegou no limite de ${builder.maxCamadas} camadas.`)
      return
    }
    if (contar(opt.id) >= grupo.max) {
      setAviso(`Até ${grupo.max}x ${opt.nome.toLowerCase()} por lanche.`)
      return
    }
    setCamadas((atual) => [...atual, novaCamada(opt.id)])
  }

  function removerUm(optId) {
    setCamadas((atual) => {
      const i = atual.map((c) => c.optId).lastIndexOf(optId)
      return i === -1 ? atual : atual.filter((_, idx) => idx !== i)
    })
  }

  const removerUid = useCallback(
    (uid) => setCamadas((atual) => atual.filter((c) => c.uid !== uid)),
    [],
  )

  function aplicarSugestao(s) {
    setPaoId(s.pao)
    setCamadas(s.camadas.map((optId) => novaCamada(optId)))
    setAviso('')
  }

  function limpar() {
    setPaoId(paoPadrao)
    setCamadas([])
    setObs('')
    setAviso('')
  }

  const resolvidas = useMemo(
    () =>
      camadas
        .map((c) => ({ ...c, opt: opcoesPorId.get(c.optId) }))
        .filter((c) => c.opt),
    [camadas],
  )

  const total = useMemo(
    () => pao.preco + resolvidas.reduce((s, c) => s + c.opt.preco, 0),
    [pao, resolvidas],
  )

  const temProteina = resolvidas.some((c) => c.opt.grupoId === 'carne')
  const soVeggie = resolvidas.length > 0 && resolvidas.every((c) => c.opt.vegetariano)

  function confirmar() {
    if (!temProteina) return

    // agrupa repetições mantendo a ordem em que foram empilhadas
    const ordem = []
    const vezes = new Map()
    camadas.forEach((c) => {
      if (!vezes.has(c.optId)) {
        vezes.set(c.optId, 0)
        ordem.push(c.optId)
      }
      vezes.set(c.optId, vezes.get(c.optId) + 1)
    })

    const extras = [
      { id: `pao:${pao.id}`, nome: pao.nome, preco: pao.preco },
      ...ordem.map((optId) => {
        const o = opcoesPorId.get(optId)
        const n = vezes.get(optId)
        return {
          id: `${optId}:${n}`,
          nome: n > 1 ? `${n}x ${o.nome}` : o.nome,
          preco: Math.round(o.preco * n * 100) / 100,
        }
      }),
    ]

    add({ id: builder.id, nome: builder.nome, preco: 0, img: null, emoji: '🍔' }, extras, obs, qtd)
    onClose()
  }

  /* ---------------- resumo + CTA (usado no mobile e no desktop) ---------------- */
  const fechamento = (className = '') => (
    <div className={className}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.62rem] tracking-[0.16em] text-ash uppercase">
            {resolvidas.length} {resolvidas.length === 1 ? 'camada' : 'camadas'}
            {qtd > 1 && ` · ${qtd} lanches`}
          </p>
          <p className="display mt-1 text-2xl text-bone">{brl(total * qtd)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button
            onClick={() => setQtd((q) => Math.max(1, q - 1))}
            disabled={qtd === 1}
            aria-label="Diminuir quantidade"
            className="grid h-8 w-8 place-items-center rounded-full text-bone transition-colors hover:bg-elevated disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-bone">{qtd}</span>
          <button
            onClick={() => setQtd((q) => Math.min(99, q + 1))}
            aria-label="Aumentar quantidade"
            className="grid h-8 w-8 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <button
        onClick={confirmar}
        disabled={!temProteina}
        className="btn btn-primary mt-3 w-full py-3.5 disabled:pointer-events-none disabled:opacity-40"
      >
        <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.2} />
        Adicionar à sacola
      </button>

      <AnimatePresence mode="wait">
        {(aviso || !temProteina) && (
          <motion.p
            key={aviso || 'proteina'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2.5 text-center text-[0.7rem] leading-snug text-gold"
          >
            {aviso || 'Escolha pelo menos uma proteína para fechar o lanche.'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          role="dialog"
          aria-label="Monte seu lanche"
          className="fixed inset-0 z-[64] flex flex-col bg-ink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ------------------------- topo ------------------------- */}
          <header className="shrink-0 border-b border-line bg-coal/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={onClose}
                  aria-label="Voltar ao cardápio"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-bone transition-colors hover:border-gold/40"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <span className="min-w-0 leading-none">
                  <span className="display block truncate text-base text-bone sm:text-lg">
                    Monte seu lanche
                  </span>
                  <span className="mt-1 hidden text-[0.6rem] tracking-[0.18em] text-ash uppercase sm:block">
                    camada por camada, do pão ao molho
                  </span>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {(resolvidas.length > 0 || paoId !== paoPadrao) && (
                  <button
                    onClick={limpar}
                    className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[0.7rem] font-semibold text-ash transition-colors hover:border-bone/30 hover:text-bone"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Começar de novo</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Fechar montador"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-bone transition-colors hover:border-bone/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col lg:flex-row lg:gap-8 lg:px-6">
            {/* ------------------------- palco ------------------------- */}
            <aside className="shrink-0 border-b border-line bg-gradient-to-b from-coal/80 to-ink px-4 pt-3 pb-3 lg:w-[21rem] lg:border-b-0 lg:bg-transparent lg:px-0 lg:pt-8">
              <div className="lg:sticky lg:top-6">
                <PilhaLanche
                  pao={pao}
                  camadas={camadas}
                  onRemover={removerUid}
                  alturaMax={desktop ? 310 : 172}
                  largura={desktop ? 224 : 150}
                />

                <div className="mt-2 flex items-center justify-between gap-3 lg:mt-4">
                  <p className="text-[0.62rem] tracking-[0.14em] text-ash uppercase">
                    {resolvidas.length > 0
                      ? 'toque numa camada para tirar'
                      : 'escolha os ingredientes ao lado'}
                  </p>
                  {soVeggie && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full border border-leaf/30 bg-leaf/10 px-2 py-0.5 text-[0.62rem] font-semibold text-leaf">
                      <Leaf className="h-3 w-3" /> veggie
                    </span>
                  )}
                </div>

                {resolvidas.length > 0 && (
                  <ol className="no-scrollbar mt-2.5 flex flex-nowrap gap-1.5 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
                    <li className="shrink-0">
                      <span className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 py-1 pr-3 pl-1.5 text-[0.68rem] font-semibold whitespace-nowrap text-gold">
                        <Miniatura opt={pao} className="h-4 w-5" />
                        {pao.nome}
                      </span>
                    </li>
                    {resolvidas.map((c) => (
                      <li key={c.uid} className="shrink-0">
                        <button
                          onClick={() => removerUid(c.uid)}
                          className="group flex items-center gap-1.5 rounded-full border border-line bg-surface/60 py-1 pr-2.5 pl-1.5 text-[0.68rem] whitespace-nowrap text-bone transition-colors hover:border-ember/50"
                        >
                          <Miniatura opt={c.opt} className="h-4 w-5" />
                          {c.opt.nome}
                          <X className="h-3 w-3 text-ash transition-colors group-hover:text-ember" />
                        </button>
                      </li>
                    ))}
                  </ol>
                )}

                {fechamento(
                  'mt-5 hidden rounded-2xl border border-line bg-surface/40 p-4 lg:block',
                )}
              </div>
            </aside>

            {/* --------------------- ingredientes --------------------- */}
            <div className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8 lg:px-0 lg:pt-8">
              <div className="flex items-center gap-3">
                <h3 className="text-[0.62rem] tracking-[0.18em] text-gold uppercase">
                  Começar de um atalho
                </h3>
                <span className="hairline flex-1" />
              </div>
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {sugestoes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => aplicarSugestao(s)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface/50 px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-bone transition-colors hover:border-gold/40"
                  >
                    <span aria-hidden>{s.emoji}</span>
                    {s.nome}
                  </button>
                ))}
              </div>

              {grupos.map((grupo) => (
                <section key={grupo.id} className="mt-8">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="display text-xl text-bone sm:text-2xl">{grupo.nome}</h2>
                      <p className="mt-1 text-xs text-ash">{grupo.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-line bg-surface/50 px-2.5 py-1 text-[0.62rem] tracking-wider text-ash uppercase">
                      {grupo.regra}
                    </span>
                  </div>

                  <ul className="mt-3.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {grupo.opcoes.map((opt) => {
                      const n = grupo.tipo === 'unico' ? (paoId === opt.id ? 1 : 0) : contar(opt.id)
                      const ativo = n > 0

                      const miolo = (
                        <>
                          <Miniatura opt={opt} className="h-11 w-12" />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-semibold text-bone">
                                {opt.nome}
                              </span>
                              {opt.vegetariano && (
                                <Leaf className="h-3 w-3 shrink-0 text-leaf" aria-label="vegetariano" />
                              )}
                            </span>
                            <span className="mt-0.5 block truncate text-[0.7rem] text-ash">
                              {opt.desc}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-gold">
                            {grupo.tipo === 'unico' ? brl(opt.preco) : `+ ${brl(opt.preco)}`}
                          </span>
                        </>
                      )

                      const borda = ativo
                        ? 'border-gold/45 bg-gold/8'
                        : 'border-line bg-surface/40 hover:border-bone/25'

                      // sem nada escolhido: a linha inteira é o botão de adicionar
                      if (!ativo || grupo.tipo === 'unico') {
                        return (
                          <li key={opt.id}>
                            <button
                              onClick={() => adicionar(grupo, opt)}
                              aria-pressed={grupo.tipo === 'unico' ? ativo : undefined}
                              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 ${borda}`}
                            >
                              {miolo}
                              <span
                                aria-hidden
                                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                                  ativo
                                    ? 'bg-gradient-to-br from-gold to-ember text-ink'
                                    : 'border border-line bg-coal text-gold'
                                }`}
                              >
                                {ativo ? (
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                ) : (
                                  <Plus className="h-4 w-4" strokeWidth={2.6} />
                                )}
                              </span>
                            </button>
                          </li>
                        )
                      }

                      // já na pilha: mostra o contador
                      return (
                        <li key={opt.id}>
                          <div
                            className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 ${borda}`}
                          >
                            {miolo}
                            <span className="flex shrink-0 items-center gap-0.5 rounded-full border border-gold/30 bg-coal p-0.5">
                              <button
                                onClick={() => removerUm(opt.id)}
                                aria-label={`Tirar um ${opt.nome}`}
                                className="grid h-7 w-7 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-gold">
                                {n}
                              </span>
                              <button
                                onClick={() => adicionar(grupo, opt)}
                                aria-label={`Mais um ${opt.nome}`}
                                className="grid h-7 w-7 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}

              <div className="mt-9">
                <label
                  htmlFor="obs-montador"
                  className="text-[0.62rem] tracking-[0.18em] text-gold uppercase"
                >
                  Alguma observação para a cozinha?
                </label>
                <textarea
                  id="obs-montador"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={2}
                  maxLength={180}
                  placeholder="Ex: carne ao ponto, molho à parte, sem gergelim…"
                  className="mt-3 w-full resize-none rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-bone placeholder:text-ash/60 focus:border-gold/50 focus:outline-none"
                />
              </div>

              <p className="mt-8 text-center text-[0.7rem] leading-relaxed text-ash/60">
                Fica pronto em cerca de {builder.tempo}. Até {builder.maxCamadas} camadas entre os
                pães — depois disso ninguém consegue morder.
              </p>
            </div>
          </div>

          {/* --------------------- rodapé no mobile --------------------- */}
          {fechamento(
            'shrink-0 border-t border-line bg-coal/95 p-4 backdrop-blur-xl lg:hidden',
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
