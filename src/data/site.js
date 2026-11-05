// ============================================================
//  CONFIGURAÇÃO DA CASA — edite só este arquivo para trocar
//  nome, telefone, unidades, taxas e horários.
// ============================================================

export const site = {
  nome: 'Brasa & Osso',
  tagline: 'Hamburgueria Artesanal',
  desde: 1998,
  cidade: 'Grande Florianópolis',
  instagram: 'https://instagram.com',
  instagramHandle: '@brasaeosso',

  // Número que recebe os pedidos do menu digital (formato internacional, só dígitos)
  whatsapp: '5548999999999',

  entrega: {
    taxaBase: 7.9,
    tempoMin: 35,
    tempoMax: 50,
    minimoGratis: 89.9,
  },

  pagamentos: ['Pix', 'Crédito', 'Débito', 'Dinheiro', 'VR / VA'],
}

export const unidades = [
  {
    id: 'centro',
    nome: 'Centro',
    cidade: 'Florianópolis',
    endereco: 'R. Felipe Schmidt, 412 — Centro',
    horario: 'Ter a Dom · 18h às 00h',
    telefone: '(48) 3222-0001',
    destaque: 'Casa matriz · chapa original de 1998',
    maps: 'https://maps.google.com/?q=Florianopolis+Centro',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=75',
  },
  {
    id: 'palhoca',
    nome: 'Palhoça',
    cidade: 'Palhoça',
    endereco: 'Av. Barão do Rio Branco, 980 — Centro',
    horario: 'Ter a Dom · 18h às 23h30',
    telefone: '(48) 3222-0002',
    destaque: 'Pátio externo e área kids',
    maps: 'https://maps.google.com/?q=Palhoca+Centro',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=75',
  },
  {
    id: 'santo-amaro',
    nome: 'Santo Amaro',
    cidade: 'Santo Amaro da Imperatriz',
    endereco: 'R. Ângelo Pedro Zanoni, 120 — Centro',
    horario: 'Qua a Dom · 18h30 às 23h',
    telefone: '(48) 3222-0003',
    destaque: 'Forno a lenha e cerveja artesanal local',
    maps: 'https://maps.google.com/?q=Santo+Amaro+da+Imperatriz',
    img: 'https://images.unsplash.com/photo-1554306297-0c86e837d24b?auto=format&fit=crop&w=900&q=75',
  },
]

export const depoimentos = [
  {
    nome: 'Marina Deschamps',
    local: 'Florianópolis',
    nota: 5,
    texto:
      'Cresci comendo o X-Salada daqui. Vinte anos depois trouxe meu filho e o sabor é exatamente o mesmo. Isso não tem preço.',
  },
  {
    nome: 'Rodrigo Althoff',
    local: 'Palhoça',
    nota: 5,
    texto:
      'O Brasa Dupla é absurdo. Carne suculenta, pão que não desmancha e o molho da casa que eu pagaria pra levar em pote.',
  },
  {
    nome: 'Juliana Feltrin',
    local: 'Santo Amaro',
    nota: 5,
    texto:
      'Pedi pelo site, chegou em 32 minutos ainda quente e embalado com cuidado. Melhor delivery de burger da região, fácil.',
  },
  {
    nome: 'Thiago Mendes',
    local: 'Florianópolis',
    nota: 5,
    texto:
      'Atendimento de casa de família e padrão de restaurante. A costela defumada do Osso Raiz desmancha na boca.',
  },
]

export const processo = [
  {
    n: '01',
    titulo: 'Carne moída na hora',
    texto:
      'Blend exclusivo de acém, peito e costela moído todo dia às 15h. Nada de hambúrguer congelado — nunca foi, nunca será.',
  },
  {
    n: '02',
    titulo: 'Chapa a 250°C',
    texto:
      'Selamos na chapa de ferro fundido que está na casa desde 1998. É ela que cria aquela crosta caramelizada e guarda o suco dentro.',
  },
  {
    n: '03',
    titulo: 'Pão e molhos da casa',
    texto:
      'Brioche assado na padaria do bairro duas vezes ao dia e seis molhos feitos na nossa cozinha, do defumado ao chimichurri.',
  },
]
