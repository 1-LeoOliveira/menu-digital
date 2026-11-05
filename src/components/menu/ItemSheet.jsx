import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock, Minus, Plus, ShoppingBag, Users, X } from 'lucide-react'
import { adicionais, brl, tagInfo } from '../../data/menu'
import { Img } from '../ui'
import { useCart } from '../../store/cart'

export function ItemSheet({ item, onClose }) {
  const { add } = useCart()
  const [qtd, setQtd] = useState(1)
  const [extras, setExtras] = useState([])
  const [obs, setObs] = useState('')

  useEffect(() => {
    setQtd(1)
    setExtras([])
    setObs('')
  }, [item?.id])

  const total = useMemo(() => {
    if (!item) return 0
    return (item.preco + extras.reduce((s, e) => s + e.preco, 0)) * qtd
  }, [item, extras, qtd])

  const toggleExtra = (ex) =>
    setExtras((atual) =>
      atual.some((e) => e.id === ex.id) ? atual.filter((e) => e.id !== ex.id) : [...atual, ex],
    )

  const confirmar = () => {
    add(item, extras, obs, qtd)
    onClose()
  }

  const comAdicionais = item && ['classicos', 'autorais', 'smash', 'veggie'].includes(item.cat)

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={item.nome}
            className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[92svh] flex-col overflow-hidden rounded-t-3xl border-t border-line bg-coal sm:inset-0 sm:m-auto sm:h-fit sm:max-w-lg sm:rounded-3xl sm:border"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="relative shrink-0">
              <Img src={item.img} emoji={item.emoji} alt={item.nome} className="h-48 w-full sm:h-56" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/20 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-ink/70 text-bone backdrop-blur-md transition-colors hover:bg-ink"
              >
                <X className="h-5 w-5" />
              </button>
              {item.tag && (
                <span
                  className={`absolute top-3 left-3 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase backdrop-blur-md ${tagInfo[item.tag].cor}`}
                >
                  {tagInfo[item.tag].label}
                </span>
              )}
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-6 pt-5 pb-4">
              <h2 className="display text-3xl text-bone">{item.nome}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ash">{item.desc}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ash">
                {item.serve && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-gold" /> serve {item.serve}
                  </span>
                )}
                {item.tempo && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" /> {item.tempo}
                  </span>
                )}
                {item.vegetariano && (
                  <span className="rounded-full border border-leaf/30 bg-leaf/10 px-2 py-0.5 font-semibold text-leaf">
                    vegetariano
                  </span>
                )}
              </div>

              {comAdicionais && (
                <div className="mt-7">
                  <h3 className="text-[0.68rem] tracking-[0.18em] text-gold uppercase">
                    Turbine seu lanche
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {adicionais.map((ex) => {
                      const ativo = extras.some((e) => e.id === ex.id)
                      return (
                        <button
                          key={ex.id}
                          onClick={() => toggleExtra(ex)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                            ativo
                              ? 'border-gold/50 bg-gold/10'
                              : 'border-line bg-surface/50 hover:border-bone/25'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                                ativo ? 'border-gold bg-gold text-ink' : 'border-ash/50'
                              }`}
                            >
                              {ativo && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </span>
                            <span className="text-sm text-bone">{ex.nome}</span>
                          </span>
                          <span className="text-sm font-semibold text-gold">
                            + {brl(ex.preco)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-7">
                <label
                  htmlFor="obs-item"
                  className="text-[0.68rem] tracking-[0.18em] text-gold uppercase"
                >
                  Alguma observação?
                </label>
                <textarea
                  id="obs-item"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={2}
                  maxLength={180}
                  placeholder="Ex: sem cebola, ponto da carne ao ponto, maionese à parte…"
                  className="mt-3 w-full resize-none rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-bone placeholder:text-ash/60 focus:border-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-line bg-ink/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                  <button
                    onClick={() => setQtd((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir"
                    className="grid h-9 w-9 place-items-center rounded-full text-bone transition-colors hover:bg-elevated disabled:opacity-30"
                    disabled={qtd === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-bone">{qtd}</span>
                  <button
                    onClick={() => setQtd((q) => Math.min(99, q + 1))}
                    aria-label="Aumentar"
                    className="grid h-9 w-9 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button onClick={confirmar} className="btn btn-primary flex-1 py-3.5">
                  <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.2} />
                  Adicionar · {brl(total)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
