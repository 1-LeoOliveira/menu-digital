import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { site } from '../data/site'
import { useCart } from '../store/cart'
import { Logo } from './Logo'

const links = [
  { href: '#historia', label: 'Nossa história' },
  { href: '#cardapio', label: 'Destaques' },
  { href: '#processo', label: 'Como fazemos' },
  { href: '#unidades', label: 'Unidades' },
]

export function Nav({ onPedir }) {
  const [solid, setSolid] = useState(false)
  const [aberto, setAberto] = useState(false)
  const { quantidade } = useCart()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          solid
            ? 'border-b border-line/80 bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label={site.nome}>
            <Logo className="h-9 w-9 shrink-0" />
            <span className="leading-none">
              <span className="display block text-lg text-bone">{site.nome}</span>
              <span className="mt-0.5 block text-[0.6rem] font-medium tracking-[0.2em] text-ash uppercase">
                desde {site.desde}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-sm font-medium text-ash transition-colors hover:text-bone"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onPedir} className="btn btn-primary hidden sm:inline-flex">
              <ShoppingBag className="h-4 w-4" strokeWidth={2.2} />
              Peça já
              {quantidade > 0 && (
                <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink/85 px-1 text-[0.7rem] font-bold text-gold">
                  {quantidade}
                </span>
              )}
            </button>

            <button
              onClick={onPedir}
              aria-label="Abrir cardápio"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-ember text-ink sm:hidden"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.3} />
              {quantidade > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.68rem] font-bold text-gold ring-1 ring-gold/40">
                  {quantidade}
                </span>
              )}
            </button>

            <button
              onClick={() => setAberto(true)}
              aria-label="Abrir navegação"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-bone transition-colors hover:border-bone/40 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-18 items-center justify-between px-5 sm:px-8">
              <Logo className="h-9 w-9" />
              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar navegação"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-bone"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col px-5 sm:px-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setAberto(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.5 }}
                  className="display border-b border-line/70 py-5 text-4xl text-bone transition-colors hover:text-gold"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-5 pt-8 sm:px-8">
              <button
                onClick={() => {
                  setAberto(false)
                  onPedir()
                }}
                className="btn btn-primary w-full py-4 text-base"
              >
                <ShoppingBag className="h-5 w-5" />
                Peça já — menu digital
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
