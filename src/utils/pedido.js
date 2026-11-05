import { brl } from '../data/menu'
import { site, unidades } from '../data/site'

export function calcularTaxa(modo, subtotal) {
  if (modo === 'retirada') return 0
  if (subtotal >= site.entrega.minimoGratis) return 0
  return site.entrega.taxaBase
}

/** Monta a mensagem do pedido para o WhatsApp. */
export function montarMensagem({ linhas, subtotal, totalLinha, modo, dados }) {
  const taxa = calcularTaxa(modo, subtotal)
  const total = subtotal + taxa
  const L = []

  L.push(`*NOVO PEDIDO — ${site.nome}*`)
  L.push('')
  L.push(`*Cliente:* ${dados.nome || '—'}`)
  L.push(`*Modo:* ${modo === 'retirada' ? 'Retirada no balcão' : 'Entrega'}`)

  if (modo === 'retirada') {
    const u = unidades.find((x) => x.id === dados.unidade) || unidades[0]
    L.push(`*Unidade:* ${u.nome} — ${u.endereco}`)
  } else {
    L.push(`*Endereço:* ${dados.endereco}, ${dados.numero}`)
    if (dados.complemento) L.push(`*Complemento:* ${dados.complemento}`)
    L.push(`*Bairro:* ${dados.bairro}`)
    if (dados.referencia) L.push(`*Referência:* ${dados.referencia}`)
  }

  L.push(`*Pagamento:* ${dados.pagamento}`)
  if (dados.pagamento === 'Dinheiro' && dados.troco) L.push(`*Troco para:* R$ ${dados.troco}`)

  L.push('')
  L.push('*ITENS*')
  linhas.forEach((l) => {
    L.push(`${l.qtd}x ${l.nome} — ${brl(totalLinha(l))}`)
    l.extras.forEach((e) => L.push(`   + ${e.nome} (${brl(e.preco)})`))
    if (l.obs) L.push(`   obs: ${l.obs}`)
  })

  L.push('')
  L.push(`Subtotal: ${brl(subtotal)}`)
  L.push(`Entrega: ${taxa === 0 ? 'grátis' : brl(taxa)}`)
  L.push(`*TOTAL: ${brl(total)}*`)

  if (dados.observacoes) {
    L.push('')
    L.push(`*Observações gerais:* ${dados.observacoes}`)
  }

  return L.join('\n')
}

export function linkWhatsapp(texto) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`
}
