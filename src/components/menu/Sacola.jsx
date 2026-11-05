import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from 'lucide-react'
import { brl } from '../../data/menu'
import { site, unidades } from '../../data/site'
import { useCart } from '../../store/cart'
import { calcularTaxa, linkWhatsapp, montarMensagem } from '../../utils/pedido'
import { Img } from '../ui'

const campoBase =
  'w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-bone placeholder:text-ash/55 focus:border-gold/50 focus:outline-none transition-colors'

export function Sacola({ aberta, onClose, modo, setModo }) {
  const { linhas, subtotal, quantidade, totalLinha, inc, dec, remove, clear } = useCart()
  const [etapa, setEtapa] = useState('itens')
  const [enviado, setEnviado] = useState(false)
  const [erros, setErros] = useState({})
  const [dados, setDados] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    referencia: '',
    unidade: unidades[0].id,
    pagamento: 'Pix',
    troco: '',
    observacoes: '',
  })

  const taxa = calcularTaxa(modo, subtotal)
  const total = subtotal + taxa
  const faltaPraFrete = Math.max(0, site.entrega.minimoGratis - subtotal)

  const set = (campo) => (e) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }))
    setErros((x) => ({ ...x, [campo]: undefined }))
  }

  const mensagem = useMemo(
    () => montarMensagem({ linhas, subtotal, totalLinha, modo, dados }),
    [linhas, subtotal, totalLinha, modo, dados],
  )

  function validar() {
    const e = {}
    if (dados.nome.trim().length < 3) e.nome = 'Informe seu nome completo'
    if (dados.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone inválido'
    if (modo === 'entrega') {
      if (!dados.endereco.trim()) e.endereco = 'Informe a rua'
      if (!dados.numero.trim()) e.numero = 'Nº'
      if (!dados.bairro.trim()) e.bairro = 'Informe o bairro'
    }
    setErros(e)
    return Object.keys(e).length === 0
  }

  function enviar() {
    if (!validar()) return
    window.open(linkWhatsapp(mensagem), '_blank', 'noopener')
    setEnviado(true)
  }

  function recomecar() {
    clear()
    setEnviado(false)
    setEtapa('itens')
    onClose()
  }

  return (
    <AnimatePresence>
      {aberta && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label="Sua sacola"
            className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[94svh] flex-col rounded-t-3xl border-t border-line bg-coal sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[27rem] sm:max-h-none sm:rounded-none sm:rounded-l-3xl sm:border-t-0 sm:border-l"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 320 }}
          >
            {/* header */}
            <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                {etapa === 'dados' && !enviado && (
                  <button
                    onClick={() => setEtapa('itens')}
                    aria-label="Voltar"
                    className="grid h-9 w-9 place-items-center rounded-full border border-line text-bone"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <h2 className="display text-xl text-bone">
                  {enviado ? 'Pedido enviado' : etapa === 'itens' ? 'Sua sacola' : 'Seus dados'}
                </h2>
                {!enviado && quantidade > 0 && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">
                    {quantidade}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar sacola"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-bone transition-colors hover:border-bone/40"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* ---------- SUCESSO ---------- */}
            {enviado ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-16 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-leaf/15 text-leaf">
                  <Check className="h-10 w-10" strokeWidth={2.4} />
                </span>
                <h3 className="display text-3xl text-bone">Tudo certo!</h3>
                <p className="text-sm leading-relaxed text-ash">
                  Seu pedido foi aberto no WhatsApp. Basta apertar enviar que a cozinha já começa.
                  Se a aba não abriu, use o botão abaixo.
                </p>
                <a
                  href={linkWhatsapp(mensagem)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary w-full py-3.5"
                >
                  Reabrir no WhatsApp
                </a>
                <button
                  onClick={recomecar}
                  className="text-sm font-semibold text-ash transition-colors hover:text-bone"
                >
                  Fazer um novo pedido
                </button>
              </div>
            ) : linhas.length === 0 ? (
              /* ---------- VAZIA ---------- */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full border border-line bg-surface text-3xl">
                  🍔
                </span>
                <h3 className="display text-2xl text-bone">Sua sacola está vazia</h3>
                <p className="text-sm text-ash">
                  Escolha um burger do cardápio e ele aparece aqui na hora.
                </p>
                <button onClick={onClose} className="btn btn-ghost mt-2">
                  Ver o cardápio
                </button>
              </div>
            ) : (
              <>
                <div className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  {/* modo de entrega */}
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface/50 p-1.5">
                    {[
                      { id: 'entrega', label: 'Entrega', Icone: Bike },
                      { id: 'retirada', label: 'Retirada', Icone: Store },
                    ].map(({ id, label, Icone }) => (
                      <button
                        key={id}
                        onClick={() => setModo(id)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${
                          modo === id
                            ? 'bg-gradient-to-br from-gold to-ember text-ink'
                            : 'text-ash hover:text-bone'
                        }`}
                      >
                        <Icone className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {modo === 'entrega' && faltaPraFrete > 0 && (
                    <p className="mt-3 rounded-xl border border-gold/25 bg-gold/8 px-4 py-2.5 text-xs text-gold">
                      Falta {brl(faltaPraFrete)} para a entrega sair de graça.
                    </p>
                  )}

                  {etapa === 'itens' ? (
                    <ul className="mt-5 space-y-3">
                      {linhas.map((l) => (
                        <li key={l.key} className="flex gap-3 rounded-2xl border border-line bg-surface/40 p-3">
                          <Img
                            src={l.img}
                            emoji={l.emoji}
                            alt={l.nome}
                            className="h-20 w-20 shrink-0 rounded-xl"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm leading-tight font-semibold text-bone">
                                {l.nome}
                              </h4>
                              <button
                                onClick={() => remove(l.key)}
                                aria-label={`Remover ${l.nome}`}
                                className="shrink-0 text-ash/60 transition-colors hover:text-ember"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {l.extras.length > 0 && (
                              <p className="mt-1 text-[0.7rem] leading-snug text-gold">
                                {l.extras.map((e) => `+ ${e.nome}`).join(' · ')}
                              </p>
                            )}
                            {l.obs && (
                              <p className="mt-1 text-[0.7rem] leading-snug text-ash italic">
                                “{l.obs}”
                              </p>
                            )}

                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-1 rounded-full border border-line bg-coal p-0.5">
                                <button
                                  onClick={() => dec(l.key)}
                                  aria-label="Diminuir"
                                  className="grid h-7 w-7 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-bone">
                                  {l.qtd}
                                </span>
                                <button
                                  onClick={() => inc(l.key)}
                                  aria-label="Aumentar"
                                  className="grid h-7 w-7 place-items-center rounded-full text-bone transition-colors hover:bg-elevated"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-bone">
                                {brl(totalLinha(l))}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    /* ---------- FORMULÁRIO ---------- */
                    <div className="mt-5 space-y-4">
                      <Campo label="Nome completo" erro={erros.nome}>
                        <input
                          value={dados.nome}
                          onChange={set('nome')}
                          placeholder="Como podemos te chamar?"
                          className={campoBase}
                          autoComplete="name"
                        />
                      </Campo>

                      <Campo label="WhatsApp" erro={erros.telefone}>
                        <input
                          value={dados.telefone}
                          onChange={set('telefone')}
                          placeholder="(48) 99999-9999"
                          inputMode="tel"
                          className={campoBase}
                          autoComplete="tel"
                        />
                      </Campo>

                      {modo === 'entrega' ? (
                        <>
                          <div className="grid grid-cols-[1fr_5rem] gap-3">
                            <Campo label="Rua" erro={erros.endereco}>
                              <input
                                value={dados.endereco}
                                onChange={set('endereco')}
                                placeholder="Rua / avenida"
                                className={campoBase}
                                autoComplete="street-address"
                              />
                            </Campo>
                            <Campo label="Número" erro={erros.numero}>
                              <input
                                value={dados.numero}
                                onChange={set('numero')}
                                placeholder="123"
                                inputMode="numeric"
                                className={campoBase}
                              />
                            </Campo>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Campo label="Bairro" erro={erros.bairro}>
                              <input
                                value={dados.bairro}
                                onChange={set('bairro')}
                                placeholder="Bairro"
                                className={campoBase}
                              />
                            </Campo>
                            <Campo label="Complemento">
                              <input
                                value={dados.complemento}
                                onChange={set('complemento')}
                                placeholder="Apto / bloco"
                                className={campoBase}
                              />
                            </Campo>
                          </div>

                          <Campo label="Ponto de referência">
                            <input
                              value={dados.referencia}
                              onChange={set('referencia')}
                              placeholder="Ex: ao lado da farmácia"
                              className={campoBase}
                            />
                          </Campo>
                        </>
                      ) : (
                        <Campo label="Retirar em qual unidade?">
                          <div className="grid gap-2">
                            {unidades.map((u) => (
                              <button
                                key={u.id}
                                onClick={() => setDados((d) => ({ ...d, unidade: u.id }))}
                                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                                  dados.unidade === u.id
                                    ? 'border-gold/50 bg-gold/10'
                                    : 'border-line bg-surface/50 hover:border-bone/25'
                                }`}
                              >
                                <span className="block text-sm font-semibold text-bone">
                                  {u.nome}
                                </span>
                                <span className="text-xs text-ash">{u.endereco}</span>
                              </button>
                            ))}
                          </div>
                        </Campo>
                      )}

                      <Campo label="Forma de pagamento">
                        <div className="flex flex-wrap gap-2">
                          {site.pagamentos.map((p) => (
                            <button
                              key={p}
                              onClick={() => setDados((d) => ({ ...d, pagamento: p }))}
                              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                                dados.pagamento === p
                                  ? 'border-gold/50 bg-gold/15 text-gold'
                                  : 'border-line bg-surface/50 text-ash hover:text-bone'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </Campo>

                      {dados.pagamento === 'Dinheiro' && (
                        <Campo label="Troco para quanto?">
                          <input
                            value={dados.troco}
                            onChange={set('troco')}
                            placeholder="Ex: 100,00"
                            inputMode="decimal"
                            className={campoBase}
                          />
                        </Campo>
                      )}

                      <Campo label="Observações do pedido">
                        <textarea
                          value={dados.observacoes}
                          onChange={set('observacoes')}
                          rows={2}
                          maxLength={240}
                          placeholder="Algo mais que a cozinha precisa saber?"
                          className={`${campoBase} resize-none`}
                        />
                      </Campo>
                    </div>
                  )}
                </div>

                {/* ---------- RESUMO + CTA ---------- */}
                <footer className="shrink-0 border-t border-line bg-ink/85 p-5 backdrop-blur-xl">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-ash">
                      <dt>Subtotal</dt>
                      <dd>{brl(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-ash">
                      <dt>{modo === 'retirada' ? 'Retirada no balcão' : 'Entrega'}</dt>
                      <dd className={taxa === 0 ? 'font-semibold text-leaf' : ''}>
                        {taxa === 0 ? 'grátis' : brl(taxa)}
                      </dd>
                    </div>
                    <div className="hairline my-2.5" />
                    <div className="flex items-baseline justify-between">
                      <dt className="display text-lg text-bone">Total</dt>
                      <dd className="display text-2xl text-fire">{brl(total)}</dd>
                    </div>
                  </dl>

                  {etapa === 'itens' ? (
                    <button
                      onClick={() => setEtapa('dados')}
                      className="btn btn-primary mt-4 w-full py-3.5 text-base"
                    >
                      Continuar
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <button onClick={enviar} className="btn btn-primary mt-4 w-full py-3.5 text-base">
                      <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.2} />
                      Finalizar no WhatsApp
                    </button>
                  )}

                  <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-ash/70">
                    {etapa === 'itens'
                      ? `Tempo estimado de ${site.entrega.tempoMin}–${site.entrega.tempoMax} min`
                      : 'Você confere o pedido no WhatsApp antes de enviar.'}
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Campo({ label, erro, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.68rem] tracking-[0.16em] text-ash uppercase">
        {label}
      </span>
      {children}
      {erro && <span className="mt-1.5 block text-[0.7rem] font-medium text-ember">{erro}</span>}
    </label>
  )
}
