# Brasa & Osso — Landing page + Menu digital

Landing page premium para hamburgueria com **menu digital completo** embutido: o botão “Peça já”
abre um cardápio em tela cheia com busca, categorias, adicionais, observações, sacola persistente
e fechamento do pedido no WhatsApp.

Stack: **Vite 8 + React 19 + Tailwind CSS 4 + Framer Motion**. Sem backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

---

## O que você provavelmente quer editar

### 1. Dados da casa — `src/data/site.js`

Nome, ano de fundação, cidade, Instagram, **número de WhatsApp que recebe os pedidos**, taxa de
entrega, tempo estimado, valor para frete grátis, formas de pagamento, unidades e depoimentos.

```js
whatsapp: '5548999999999',   // só dígitos, com 55 + DDD
entrega: { taxaBase: 7.9, tempoMin: 35, tempoMax: 50, minimoGratis: 89.9 },
```

### 2. Cardápio — `src/data/menu.js`

- `categorias`: ordem e nome das abas do menu digital. `destaques` é uma categoria virtual que
  junta tudo que tem `destaque: true` ou `tag: 'mais-pedido'`.
- `itens`: cada item aceita
  `id, cat, nome, desc, preco, precoDe, img, emoji, tag, destaque, serve, tempo, vegetariano`.
- `adicionais`: lista global de extras oferecida nos hambúrgueres.
- `tag` aceita `mais-pedido`, `novidade`, `picante` ou `chef`.
- Item sem foto: use `img: null` e um `emoji` (ex.: `'🍺'`) — o card desenha um tile estilizado.

### 3. Fotos

As fotos atuais são do Unsplash, carregadas por URL, apenas como **placeholder**. Para usar as
fotos reais da casa:

1. coloque os arquivos em `public/fotos/`;
2. troque o valor de `img` para `'/fotos/x-salada.jpg'`.

Isso vale também para `src/data/site.js` (unidades) e para os blocos de imagem em
`src/components/Hero.jsx`, `Historia.jsx`, `Processo.jsx` e `Rodape.jsx`.

### 4. Cores e tipografia — `src/index.css`

Tudo sai dos tokens no bloco `@theme`:

| token | uso |
| --- | --- |
| `--color-ink` / `--color-coal` | fundos |
| `--color-ember` / `--color-gold` | gradiente de marca (botões, destaques) |
| `--color-bone` / `--color-ash` | texto principal / secundário |
| `--font-display` | títulos (Anton) |
| `--font-serif` | trechos em itálico (Instrument Serif) |

---

## Como o pedido chega até você

O cliente monta a sacola, escolhe **entrega ou retirada**, preenche nome, WhatsApp, endereço (ou a
unidade de retirada) e a forma de pagamento. Ao finalizar, o app abre o WhatsApp com a mensagem já
formatada — itens, adicionais, observações, subtotal, frete e total. Nada é enviado sem o cliente
apertar enviar.

A sacola fica salva no `localStorage` do navegador: se a pessoa fechar a aba e voltar, o pedido
continua lá.

## Estrutura

```
src/
  data/site.js          configuração da casa, unidades, depoimentos
  data/menu.js          cardápio, adicionais, categorias, formatador de preço
  store/cart.jsx        carrinho (context + reducer + localStorage)
  utils/pedido.js       taxa de entrega e mensagem do WhatsApp
  components/
    Nav, Hero, Marquee, Destaques, Historia,
    Processo, Avaliacoes, Unidades, Rodape      seções da landing
    ui.jsx                                      Reveal, Img, scroll lock, Esc
    menu/MenuDigital.jsx                        overlay do cardápio
    menu/ItemSheet.jsx                          detalhe do item + adicionais
    menu/Sacola.jsx                             sacola + checkout + WhatsApp
```

## Próximos passos sugeridos

- Trocar as fotos pelas reais da casa (é o que mais muda a percepção de valor).
- Ligar um Pixel/GA4 no clique de “Peça já” e no “Finalizar no WhatsApp”.
- Se um dia houver cozinha com sistema próprio, `utils/pedido.js` é o único arquivo a mudar para
  enviar o pedido via API em vez de WhatsApp.
