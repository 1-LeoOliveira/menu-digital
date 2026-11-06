# Brasa & Osso — Landing page + Menu digital

Landing page premium para hamburgueria com **menu digital completo** embutido: o botão “Peça já”
abre um cardápio em tela cheia com busca, categorias, adicionais, observações, sacola persistente
e fechamento do pedido no WhatsApp. Dentro dele tem o **“Monte seu lanche”**: um montador onde
cada ingrediente escolhido cai na tela e empilha um lanche de verdade, montado com fotos
recortadas.

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

### 3. Monte seu lanche — `src/data/builder.js`

É o montador visual. Tudo que aparece nele sai deste arquivo:

- `grupos`: as seções do montador (pão, proteína, queijo, da chapa, salada, molhos). O primeiro
  grupo é sempre o pão (`tipo: 'unico'` — escolhe só um); os outros são `tipo: 'multiplo'` com
  `max` por ingrediente.
- cada opção tem `id, nome, desc, preco, vegetariano` e os campos da montagem:

| campo | o que faz |
| --- | --- |
| `img` | o recorte que entra na pilha (`/ingredientes/bacon.webp`) |
| `imgBase` | só no pão: a metade de baixo |
| `largura` | largura da camada em % da largura da pilha — é a escala relativa |
| `fatia` | quanto da altura da foto vira altura de verdade; o resto cobre a camada de baixo. Menor = camada mais fina |
| `cor` | cor dominante, usada no brilho e se a foto não carregar |

- `builder.maxCamadas` limita a torre (padrão: 10 camadas entre os pães).
- `sugestoes`: os atalhos (“Do clássico”, “Do monstro”…) que já montam uma combinação pronta.
- `previewBanner`: o lanche estático que aparece no banner do cardápio.

O lanche montado entra na sacola como um item só, com cada ingrediente listado como adicional —
então a mensagem do WhatsApp já sai itemizada para a cozinha.

#### As fotos dos ingredientes

As fotos originais (fundo branco) ficam em `fotos-originais/ingredientes/` — **fora** de `public/`,
para não irem no build. O script de recorte tira o fundo e a sombra, joga fora pedaços de outros
ingredientes que aparecem na mesma foto, corta no limite do objeto e salva WebP com transparência:

```bash
npm run ingredientes
```

Isso regrava `public/ingredientes/*.webp` e `src/data/medidas-ingredientes.js` (o tamanho de cada
recorte, que a pilha usa para calcular a altura das camadas). Para os pães ele também gera a
metade de baixo, espelhando e achatando a foto.

Para **trocar ou acrescentar** um ingrediente: coloque o `.jpg` em `fotos-originais/ingredientes/`
(objeto sozinho, fundo branco, de lado ou em 3/4 — é o ângulo que empilha bem), rode
`npm run ingredientes` e aponte o `img` da opção para o arquivo novo.

Se sobrar mancha clara do prato em alguma foto, afrouxe a tolerância dela na tabela `AJUSTES`,
no começo de `scripts/recortar-ingredientes.mjs`.

Para conferir como a pilha fica sem abrir o navegador:

```bash
npm run previa-pilha    # gera previa-pilha.jpg com vários lanches montados
```

É a mesma matemática do componente, então serve para calibrar `largura` e `fatia`.

### 4. Fotos

As fotos atuais são do Unsplash, carregadas por URL, apenas como **placeholder**. Para usar as
fotos reais da casa:

1. coloque os arquivos em `public/fotos/`;
2. troque o valor de `img` para `'/fotos/x-salada.jpg'`.

Isso vale também para `src/data/site.js` (unidades) e para os blocos de imagem em
`src/components/Hero.jsx`, `Historia.jsx`, `Processo.jsx` e `Rodape.jsx`.

### 5. Cores e tipografia — `src/index.css`

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
  data/builder.js       ingredientes do “Monte seu lanche” + geometria das camadas
  data/medidas-ingredientes.js   gerado: tamanho de cada recorte
  store/cart.jsx        carrinho (context + reducer + localStorage)
  utils/pedido.js       taxa de entrega e mensagem do WhatsApp
  components/
    Nav, Hero, Marquee, Destaques, Historia,
    Processo, Avaliacoes, Unidades, Rodape      seções da landing
    ui.jsx                                      Reveal, Img, scroll lock, Esc
    menu/MenuDigital.jsx                        overlay do cardápio
    menu/ItemSheet.jsx                          detalhe do item + adicionais
    menu/MonteSeuLanche.jsx                     montador: ingredientes, total e sacola
    menu/PilhaLanche.jsx                        a pilha animada (fotos caindo e empilhando)
    menu/Sacola.jsx                             sacola + checkout + WhatsApp
```

```
scripts/
  recortar-ingredientes.mjs   fotos originais -> recortes sem fundo (npm run ingredientes)
  previa-pilha.mjs            rende lanches montados num JPG (npm run previa-pilha)
fotos-originais/ingredientes/ as fotos originais, fundo branco
public/ingredientes/          os recortes usados pelo montador
```

## Próximos passos sugeridos

- Trocar as fotos pelas reais da casa (é o que mais muda a percepção de valor).
- Ligar um Pixel/GA4 no clique de “Peça já” e no “Finalizar no WhatsApp”.
- Se um dia houver cozinha com sistema próprio, `utils/pedido.js` é o único arquivo a mudar para
  enviar o pedido via API em vez de WhatsApp.
