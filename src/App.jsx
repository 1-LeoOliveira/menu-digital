import { useState } from 'react'
import { CartProvider } from './store/cart'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Destaques } from './components/Destaques'
import { Historia } from './components/Historia'
import { Processo } from './components/Processo'
import { Avaliacoes } from './components/Avaliacoes'
import { Unidades } from './components/Unidades'
import { ChamadaFinal, Rodape } from './components/Rodape'
import { MenuDigital } from './components/menu/MenuDigital'

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false)
  const abrirMenu = () => setMenuAberto(true)

  return (
    <CartProvider>
      <Nav onPedir={abrirMenu} />

      <main>
        <Hero onPedir={abrirMenu} />
        <Marquee />
        <Destaques onPedir={abrirMenu} />
        <Historia />
        <Processo />
        <Avaliacoes />
        <Unidades />
        <ChamadaFinal onPedir={abrirMenu} />
      </main>

      <Rodape />

      <MenuDigital aberto={menuAberto} onClose={() => setMenuAberto(false)} />
    </CartProvider>
  )
}
