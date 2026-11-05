import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/** Revela o conteúdo quando entra na viewport. */
export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Imagem com skeleton, lazy-load e fallback caso a URL falhe ou não exista. */
export function Img({ src, alt, className = '', eager = false, sizes, emoji = '🍔' }) {
  const [state, setState] = useState(src ? 'loading' : 'error')

  return (
    <span className={`relative block overflow-hidden bg-surface ${className}`}>
      {state !== 'ok' && (
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(130deg,#221e1c,#2e2826,#1a1716)]"
        />
      )}
      {state === 'error' ? (
        <span
          aria-hidden
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_120%_at_30%_15%,rgba(255,176,32,.14),transparent_62%)] text-[clamp(1.75rem,28%,3.5rem)] select-none"
        >
          {emoji}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            state === 'ok' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  )
}

/** Trava o scroll do body enquanto ativo (usado pelo menu digital). */
export function useScrollLock(ativo) {
  useEffect(() => {
    if (!ativo) return
    const y = window.scrollY
    const { body } = document
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      Object.assign(body.style, prev)
      window.scrollTo({ top: y, behavior: 'instant' })
    }
  }, [ativo])
}

/** Fecha ao pressionar Esc. */
export function useEscape(ativo, onClose) {
  useEffect(() => {
    if (!ativo) return
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [ativo, onClose])
}

export function Stars({ n = 5, className = 'text-gold' }) {
  return (
    <span className={`text-sm tracking-[0.18em] ${className}`} aria-label={`${n} de 5 estrelas`}>
      {'★'.repeat(n)}
    </span>
  )
}
