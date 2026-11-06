import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'brasa-osso-cart-v1'

const CartContext = createContext(null)

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Linha única por combinação de item + adicionais + observação. */
const lineKey = (itemId, extras, obs) =>
  `${itemId}::${extras
    .map((e) => e.id)
    .sort()
    .join(',')}::${obs.trim().toLowerCase()}`

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { item, extras = [], obs = '', qtd = 1 } = action
      const key = lineKey(item.id, extras, obs)
      const found = state.find((l) => l.key === key)
      if (found) {
        return state.map((l) => (l.key === key ? { ...l, qtd: Math.min(l.qtd + qtd, 99) } : l))
      }
      return [
        ...state,
        {
          key,
          itemId: item.id,
          nome: item.nome,
          preco: item.preco,
          img: item.img,
          emoji: item.emoji,
          extras,
          obs: obs.trim(),
          qtd,
        },
      ]
    }
    case 'inc':
      return state.map((l) => (l.key === action.key ? { ...l, qtd: Math.min(l.qtd + 1, 99) } : l))
    case 'dec':
      return state
        .map((l) => (l.key === action.key ? { ...l, qtd: l.qtd - 1 } : l))
        .filter((l) => l.qtd > 0)
    case 'remove':
      return state.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [linhas, dispatch] = useReducer(reducer, undefined, readStorage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(linhas))
    } catch {
      /* modo privado / storage bloqueado: segue sem persistir */
    }
  }, [linhas])

  const value = useMemo(() => {
    const totalLinha = (l) =>
      (l.preco + l.extras.reduce((s, e) => s + e.preco, 0)) * l.qtd
    const subtotal = linhas.reduce((s, l) => s + totalLinha(l), 0)
    const quantidade = linhas.reduce((s, l) => s + l.qtd, 0)

    return {
      linhas,
      subtotal,
      quantidade,
      totalLinha,
      add: (item, extras, obs, qtd) => dispatch({ type: 'add', item, extras, obs, qtd }),
      inc: (key) => dispatch({ type: 'inc', key }),
      dec: (key) => dispatch({ type: 'dec', key }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      qtdDoItem: (itemId) =>
        linhas.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qtd, 0),
    }
  }, [linhas])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return ctx
}
