// ============================================================
//  MONTE SEU LANCHE — ingredientes do montador visual.
//
//  Cada opção aponta para um recorte em public/ingredientes/ (PNG com
//  fundo transparente, gerado por `npm run ingredientes` a partir das
//  fotos em fotos-originais/ingredientes/).
//
//  Campos da montagem:
//    img       recorte usado na pilha
//    imgBase   só para pão: a metade de baixo
//    largura   largura da camada em % da largura da pilha (escala relativa)
//    fatia     quanto da altura da foto vira altura de verdade na pilha —
//              o resto sobrepõe a camada de baixo. Menor = camada mais fina.
//    cor       cor dominante: usada no brilho da camada e se a foto falhar
//
//  Para ajustar o visual da pilha mexa em `largura` e `fatia`. Para trocar
//  a foto, troque o arquivo em fotos-originais/ingredientes/ e rode
//  `npm run ingredientes` de novo.
// ============================================================

import { medidas } from './medidas-ingredientes.js'

export const builder = {
  id: 'monte-seu-lanche',
  nome: 'Monte Seu Lanche',
  tempo: '25 min',
  maxCamadas: 10, // a torre tem limite — segura o pedido impossível de montar
}

const foto = (slug) => `/ingredientes/${slug}.webp`

/** Proporção altura/largura do recorte, para calcular a altura da camada. */
export function proporcao(src) {
  const slug = src?.split('/').pop()?.replace(/.w+$/, '')
  const m = medidas[slug]
  return m ? m.h / m.w : 0.5
}

export const grupos = [
  {
    id: 'pao',
    nome: 'O pão',
    regra: 'escolha 1',
    desc: 'A base de tudo. Dá para montar sem pão também.',
    tipo: 'unico',
    opcoes: [
      {
        id: 'pao-brioche',
        nome: 'Brioche artesanal',
        desc: 'Macio, levemente adocicado, com brilho de manteiga.',
        preco: 8.9,
        img: foto('pao_brioche'),
        imgBase: foto('pao_brioche_base'),
        largura: 100,
        fatia: 0.76,
        fatiaBase: 0.88,
        cor: '#d9913f',
      },
      {
        id: 'pao-gergelim',
        nome: 'Pão com gergelim',
        desc: 'O clássico de lanchonete, coberto de gergelim.',
        preco: 7.9,
        img: foto('pao_gergelim'),
        imgBase: foto('pao_gergelim_base'),
        largura: 100,
        fatia: 0.76,
        fatiaBase: 0.88,
        cor: '#dca45a',
      },
      {
        id: 'pao-australiano',
        nome: 'Pão australiano',
        desc: 'Escuro, docinho, aquele que não desmancha.',
        preco: 10.9,
        img: foto('pao_australiano'),
        imgBase: foto('pao_australiano_base'),
        largura: 100,
        fatia: 0.76,
        fatiaBase: 0.88,
        cor: '#6b3a1c',
      },
      {
        id: 'pao-tradicional',
        nome: 'Pão tradicional',
        desc: 'Liso, claro e macio. Sem frescura.',
        preco: 7.5,
        img: foto('pao_tradicional'),
        imgBase: foto('pao_tradicional_base'),
        largura: 100,
        fatia: 0.76,
        fatiaBase: 0.88,
        cor: '#e2a85c',
      },
      {
        id: 'pao-nenhum',
        nome: 'Sem pão, no prato',
        desc: 'Tudo embalado em folhas de alface. Low carb.',
        preco: 6.9,
        img: foto('alface'),
        imgBase: foto('alface'),
        espelharBase: true,
        largura: 98,
        fatia: 0.4,
        fatiaBase: 0.4,
        cor: '#7ab93f',
        vegetariano: true,
      },
    ],
  },
  {
    id: 'carne',
    nome: 'A proteína',
    regra: 'pelo menos 1 · até 3',
    desc: 'Pode empilhar: cada uma vira uma camada.',
    tipo: 'multiplo',
    max: 3,
    opcoes: [
      {
        id: 'blend-160',
        nome: 'Blend da casa 160g',
        desc: 'Acém, peito e costela moídos na hora, marcas da grelha.',
        preco: 15.9,
        img: foto('hamburguer_bovino'),
        largura: 94,
        fatia: 0.3,
        cor: '#6b3f21',
      },
      {
        id: 'smash-90',
        nome: 'Disco smash 90g',
        desc: 'Prensado até formar crosta. Fino e crocante na beirada.',
        preco: 10.9,
        img: foto('hamburguer_bovino'),
        largura: 84,
        fatia: 0.2,
        cor: '#6b3f21',
      },
      {
        id: 'frango-grelhado',
        nome: 'Frango grelhado',
        desc: 'Peito temperado e marcado na chapa.',
        preco: 13.9,
        img: foto('frango_grelhado'),
        largura: 92,
        fatia: 0.26,
        cor: '#b9752f',
      },
    ],
  },
  {
    id: 'queijo',
    nome: 'O queijo',
    regra: 'até 4',
    desc: 'Vai derretendo em cima da carne quente.',
    tipo: 'multiplo',
    max: 4,
    opcoes: [
      {
        id: 'cheddar',
        nome: 'Cheddar',
        desc: 'Fatia alaranjada, sabor marcante.',
        preco: 6.0,
        img: foto('queijo_cheddar'),
        largura: 96,
        fatia: 0.14,
        cor: '#f0a51f',
      },
      {
        id: 'prato',
        nome: 'Queijo prato',
        desc: 'O clássico da chapa, derretido no capricho.',
        preco: 5.0,
        img: foto('queijo_prato'),
        largura: 96,
        fatia: 0.14,
        cor: '#f3cf6a',
      },
      {
        id: 'mussarela',
        nome: 'Mussarela',
        desc: 'Suave, derrete fácil e agrada todo mundo.',
        preco: 5.5,
        img: foto('mussarela'),
        largura: 96,
        fatia: 0.14,
        cor: '#f6e9c4',
      },
      {
        id: 'suico',
        nome: 'Queijo suíço',
        desc: 'Furadinho, sabor de nozes.',
        preco: 7.5,
        img: foto('queijo_suico'),
        largura: 94,
        fatia: 0.14,
        cor: '#f2d67e',
      },
    ],
  },
  {
    id: 'chapa',
    nome: 'Da chapa',
    regra: 'até 6',
    desc: 'O que faz o lanche crescer de verdade.',
    tipo: 'multiplo',
    max: 6,
    opcoes: [
      {
        id: 'bacon',
        nome: 'Bacon em fatias',
        desc: 'Tostado até ficar crocante.',
        preco: 7.0,
        img: foto('bacon'),
        largura: 96,
        fatia: 0.15,
        cor: '#a8402a',
      },
      {
        id: 'ovo-frito',
        nome: 'Ovo frito',
        desc: 'Gema mole, clara com beirada crocante.',
        preco: 4.0,
        img: foto('ovo_frito'),
        largura: 88,
        fatia: 0.2,
        cor: '#f0c24a',
      },
      {
        id: 'cebola-caramelizada',
        nome: 'Cebola caramelizada',
        desc: 'Caramelizada no shoyu, bem devagar.',
        preco: 5.0,
        img: foto('cebola_caramelizada'),
        largura: 90,
        fatia: 0.2,
        cor: '#b9762c',
        vegetariano: true,
      },
      {
        id: 'crispy-onion',
        nome: 'Crispy onion',
        desc: 'Fios de cebola empanados e fritos na hora.',
        preco: 6.5,
        img: foto('crispy_onion'),
        largura: 90,
        fatia: 0.22,
        cor: '#d98d35',
        vegetariano: true,
      },
    ],
  },
  {
    id: 'salada',
    nome: 'A salada',
    regra: 'até 5',
    desc: 'Frescor para equilibrar a chapa.',
    tipo: 'multiplo',
    max: 5,
    opcoes: [
      {
        id: 'alface',
        nome: 'Alface crespa',
        desc: 'Folha crocante, bem gelada.',
        preco: 2.5,
        img: foto('alface'),
        largura: 104,
        fatia: 0.2,
        cor: '#7ab93f',
        vegetariano: true,
      },
      {
        id: 'tomate',
        nome: 'Tomate em rodelas',
        desc: 'Italiano, cortado grosso.',
        preco: 2.5,
        img: foto('tomate'),
        largura: 90,
        fatia: 0.2,
        cor: '#d93a24',
        vegetariano: true,
      },
      {
        id: 'cebola-roxa',
        nome: 'Cebola roxa',
        desc: 'Crua, em anéis finos.',
        preco: 2.5,
        img: foto('cebola_roxa'),
        largura: 92,
        fatia: 0.16,
        cor: '#a4518f',
        vegetariano: true,
      },
      {
        id: 'picles',
        nome: 'Picles',
        desc: 'Curtido na casa, corta a gordura.',
        preco: 3.0,
        img: foto('picles'),
        largura: 84,
        fatia: 0.15,
        cor: '#8aa33a',
        vegetariano: true,
      },
      {
        id: 'jalapeno',
        nome: 'Jalapeño',
        desc: 'Picante na medida, em rodelas.',
        preco: 3.5,
        img: foto('jalapeno'),
        largura: 84,
        fatia: 0.15,
        cor: '#7f9e33',
        vegetariano: true,
      },
      {
        id: 'abacate',
        nome: 'Abacate',
        desc: 'Fatias maduras, cremosas.',
        preco: 6.9,
        img: foto('abacate'),
        largura: 86,
        fatia: 0.17,
        cor: '#8cb258',
        vegetariano: true,
      },
    ],
  },
  {
    id: 'molho',
    nome: 'Os molhos',
    regra: 'até 3',
    desc: 'Vão por cima, na hora de fechar.',
    tipo: 'multiplo',
    max: 3,
    opcoes: [
      {
        id: 'maionese',
        nome: 'Maionese da casa',
        desc: 'Batida aqui, com limão e alho.',
        preco: 3.0,
        img: foto('maionese'),
        largura: 58,
        fatia: 0.1,
        cor: '#f2dfa8',
        vegetariano: true,
      },
      {
        id: 'ketchup',
        nome: 'Ketchup',
        desc: 'O de sempre, na medida certa.',
        preco: 2.5,
        img: foto('ketchup'),
        largura: 58,
        fatia: 0.1,
        cor: '#cf2318',
        vegetariano: true,
      },
      {
        id: 'mostarda',
        nome: 'Mostarda',
        desc: 'Amarela, levemente ácida.',
        preco: 2.5,
        img: foto('mostarda'),
        largura: 58,
        fatia: 0.1,
        cor: '#e8b81e',
        vegetariano: true,
      },
      {
        id: 'barbecue',
        nome: 'Barbecue da casa',
        desc: 'Melaço, fumaça e um toque de café.',
        preco: 3.5,
        img: foto('barbecue'),
        largura: 58,
        fatia: 0.1,
        cor: '#6d2c14',
        vegetariano: true,
      },
    ],
  },
]

/** Atalhos: começam a montagem com uma combinação pronta. */
export const sugestoes = [
  {
    id: 'classico',
    nome: 'Do clássico',
    emoji: '🍔',
    pao: 'pao-gergelim',
    camadas: ['blend-160', 'prato', 'alface', 'tomate', 'maionese'],
  },
  {
    id: 'monstro',
    nome: 'Do monstro',
    emoji: '🔥',
    pao: 'pao-australiano',
    camadas: ['blend-160', 'cheddar', 'blend-160', 'cheddar', 'bacon', 'crispy-onion', 'barbecue'],
  },
  {
    id: 'frango',
    nome: 'Do frango',
    emoji: '🐔',
    pao: 'pao-brioche',
    camadas: ['frango-grelhado', 'suico', 'alface', 'abacate', 'maionese'],
  },
  {
    id: 'sem-pao',
    nome: 'Sem pão',
    emoji: '🥬',
    pao: 'pao-nenhum',
    camadas: ['blend-160', 'cheddar', 'bacon', 'tomate'],
  },
]

/** Mapa id -> { ...opcao, grupoId } para lookup rápido. */
export const opcoesPorId = new Map(
  grupos.flatMap((g) => g.opcoes.map((o) => [o.id, { ...o, grupoId: g.id }])),
)

export const grupoPao = grupos[0]
export const paoPadrao = 'pao-brioche'

/** Lanche estático que aparece no banner do cardápio. */
export const previewBanner = {
  pao: 'pao-gergelim',
  camadas: ['blend-160', 'cheddar', 'bacon', 'alface', 'tomate'],
}
