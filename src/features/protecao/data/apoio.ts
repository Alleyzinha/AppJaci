export const RECURSOS_OFICIAIS = {
  mulher180: 'https://www.gov.br/mulheres/pt-br/ligue180',
  saudeMentalSUS:
    'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/sus-e-a-saude-mental',
  caps: 'https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps/caps/',
};

export const TOPICOS_ACOLHIMENTO = [
  {
    id: 'seguranca',
    titulo: 'Encontrar um lugar mais seguro',
    icone: 'location-outline',
    orientacao:
      'Se puder, aproxime-se de um local com outras pessoas e uma saída. Em perigo imediato, ligue 190. Você não precisa explicar tudo para pedir ajuda.',
  },
  {
    id: 'apoio',
    titulo: 'Pedir apoio a alguém de confiança',
    icone: 'people-outline',
    orientacao:
      'Escolha alguém que respeite suas decisões. Se for seguro, combine uma palavra ou mensagem curta para avisar quando precisar de companhia.',
  },
  {
    id: 'registro',
    titulo: 'Registrar o que aconteceu, se for seguro',
    icone: 'book-outline',
    orientacao:
      'Você pode anotar datas, horários e o que lembra, ou guardar mensagens e arquivos no Diário. Só faça isso se não aumentar o risco. Você não precisa reunir provas para buscar ajuda.',
  },
  {
    id: 'pausa',
    titulo: 'Fazer uma pausa no seu ritmo',
    icone: 'heart-outline',
    orientacao:
      'Se ajudar, perceba os pés no chão, respire devagar e escolha uma pequena ação para os próximos minutos. Você pode pular esta sugestão e procurar alguém de confiança.',
  },
];

export const SERVICOS_PUBLICOS = [
  {
    id: 'caps',
    titulo: 'CAPS · Centros de Atenção Psicossocial',
    descricao:
      'Serviço público do SUS com acolhimento, apoio psicológico e terapias. O primeiro acolhimento pode ser procurado diretamente; a oferta depende da modalidade e do município.',
    url: RECURSOS_OFICIAIS.caps,
    icone: 'medical-outline',
    acao: 'Ver informações oficiais',
  },
  {
    id: 'sus',
    titulo: 'Rede de Saúde Mental do SUS',
    descricao:
      'Conheça a Rede de Atenção Psicossocial e os caminhos de cuidado na saúde pública, incluindo a atenção básica e as UBS.',
    url: RECURSOS_OFICIAIS.saudeMentalSUS,
    icone: 'business-outline',
    acao: 'Conhecer a rede do SUS',
  },
  {
    id: '180',
    titulo: 'Central de Atendimento à Mulher · 180',
    descricao:
      'Orientação e informações sobre a rede de serviços. Atendimento telefônico gratuito, 24 horas por dia.',
    url: RECURSOS_OFICIAIS.mulher180,
    icone: 'call-outline',
    acao: 'Ver canais oficiais',
    telefone: '180',
  },
];
