export interface Field {
  k: string;   // Label/key name
  v: any;      // Selected/entered value
  t: string;   // Input type (text, number, date, timerange, longtext, select, multi)
  opts?: string[]; // Optional options for selects/checkboxes
}

export interface CardDef {
  label: string;
  cat: string;
  icon: string;
  what?: string;
  how?: string;
  fields: Field[];
}

export const CATS: Record<string, { color: string }> = {
  Essenciais: { color: '#1D9E75' },
  Atividades: { color: '#534AB7' },
  'Métodos': { color: '#D85A30' },
  Financiamento: { color: '#BA7517' },
  'Comunicação': { color: '#993556' },
  Importadas: { color: '#888780' },
  FIB16: { color: '#2F4E9E' },
};

export const TOOLBOX_CATS = ['Essenciais', 'Atividades', 'Métodos', 'Financiamento', 'Comunicação', 'Importadas'];

export const TYPE_ICON: Record<string, string> = {
  text: 'ti-align-left',
  number: 'ti-number',
  date: 'ti-calendar',
  timerange: 'ti-clock-hour-4',
  longtext: 'ti-text-caption',
  select: 'ti-list-check',
  multi: 'ti-checkbox'
};

export const TYPE_LABEL: Record<string, string> = {
  text: 'Texto curto',
  number: 'Número',
  date: 'Data',
  timerange: 'Horário (intervalo)',
  longtext: 'Parágrafo',
  select: 'Opção única',
  multi: 'Múltipla escolha'
};

export const DEFS: Record<string, CardDef> = {
  local: {
    label: 'Local',
    cat: 'Essenciais',
    icon: 'ti-map-pin',
    what: 'Define onde a ação acontece.',
    how: 'Conecte a atividades para indicar onde ocorrem.',
    fields: [
      { k: 'Endereço', v: '', t: 'text' },
      { k: 'Bairro', v: '', t: 'text' },
      { k: 'Cidade', v: 'São Paulo', t: 'text' }
    ]
  },
  data: {
    label: 'Data',
    cat: 'Essenciais',
    icon: 'ti-calendar',
    what: 'Marca o dia da ação.',
    how: 'Digite os números e a data se formata sozinha.',
    fields: [
      { k: 'Data', v: '', t: 'date' },
      { k: 'Dia da semana', v: '', t: 'text' }
    ]
  },
  horario: {
    label: 'Horário',
    cat: 'Essenciais',
    icon: 'ti-clock-hour-4',
    what: 'Intervalo de tempo de uma atividade, com cálculo da duração.',
    how: 'Preencha "das 09:00 às 11:30" e veja a duração.',
    fields: [
      { k: 'Período', v: '', t: 'timerange' }
    ]
  },
  duracao: {
    label: 'Duração',
    cat: 'Essenciais',
    icon: 'ti-hourglass',
    what: 'Quanto tempo leva, em minutos.',
    how: 'Use quando sabe a duração mas não os horários.',
    fields: [
      { k: 'Duração (minutos)', v: '', t: 'number' },
      { k: 'Observações', v: '', t: 'text' }
    ]
  },
  publico: {
    label: 'Público-alvo',
    cat: 'Essenciais',
    icon: 'ti-users',
    what: 'Para quem a ação é destinada.',
    how: 'Defina perfil e número esperado.',
    fields: [
      { k: 'Perfil', v: '', t: 'text' },
      { k: 'Nº esperado', v: '', t: 'number' }
    ]
  },
  workshop: {
    label: 'Workshop',
    cat: 'Atividades',
    icon: 'ti-presentation',
    what: 'Atividade formativa prática.',
    how: 'Conecte a Local, Data e Horário.',
    fields: [
      { k: 'Tema', v: '', t: 'text' },
      { k: 'Facilitador', v: '', t: 'text' },
      { k: 'Período', v: '', t: 'timerange' },
      { k: 'Modalidade', v: '', t: 'select', opts: ['Presencial', 'Online', 'Híbrido'] }
    ]
  },
  caminhada: {
    label: 'Caminhada',
    cat: 'Atividades',
    icon: 'ti-walk',
    what: 'Percurso a pé pelo território.',
    how: 'Defina percurso e distância.',
    fields: [
      { k: 'Percurso', v: '', t: 'text' },
      { k: 'Distância (km)', v: '', t: 'number' },
      { k: 'Período', v: '', t: 'timerange' }
    ]
  },
  coffee: {
    label: 'Coffee Break',
    cat: 'Atividades',
    icon: 'ti-coffee',
    what: 'Pausa para alimentação.',
    how: 'Encaixe entre blocos de atividade.',
    fields: [
      { k: 'Período', v: '', t: 'timerange' },
      { k: 'Fornecedor', v: '', t: 'text' }
    ]
  },
  palestra: {
    label: 'Palestra',
    cat: 'Atividades',
    icon: 'ti-microphone',
    what: 'Apresentação expositiva.',
    how: 'Defina tema e palestrante.',
    fields: [
      { k: 'Tema', v: '', t: 'text' },
      { k: 'Palestrante', v: '', t: 'text' },
      { k: 'Período', v: '', t: 'timerange' }
    ]
  },
  escuta: {
    label: 'Escuta ativa',
    cat: 'Métodos',
    icon: 'ti-ear',
    what: 'Coleta de percepções da comunidade.',
    how: 'Registre objetivo e público.',
    fields: [
      { k: 'Objetivo', v: '', t: 'longtext' },
      { k: 'Público', v: '', t: 'text' }
    ]
  },
  mapeamento: {
    label: 'Mapeamento',
    cat: 'Métodos',
    icon: 'ti-map',
    what: 'Levantamento de elementos do território.',
    how: 'Use no diagnóstico.',
    fields: [
      { k: 'Área mapeada', v: '', t: 'text' },
      { k: 'Método', v: '', t: 'text' }
    ]
  },
  edital: {
    label: 'Edital',
    cat: 'Financiamento',
    icon: 'ti-file-text',
    what: 'Recurso via chamada pública.',
    how: 'Informe nome, valor e prazo.',
    fields: [
      { k: 'Nome do edital', v: '', t: 'text' },
      { k: 'Valor (R$)', v: '', t: 'number' },
      { k: 'Prazo', v: '', t: 'date' }
    ]
  },
  doacao: {
    label: 'Doação',
    cat: 'Financiamento',
    icon: 'ti-heart',
    what: 'Recurso recebido por doação.',
    how: 'Informe origem e valor.',
    fields: [
      { k: 'Origem', v: '', t: 'text' },
      { k: 'Valor (R$)', v: '', t: 'number' }
    ]
  },
  release: {
    label: 'Release',
    cat: 'Comunicação',
    icon: 'ti-speakerphone',
    what: 'Texto de divulgação para imprensa.',
    how: 'Defina veículos e data.',
    fields: [
      { k: 'Veículos', v: '', t: 'text' },
      { k: 'Data de envio', v: '', t: 'date' }
    ]
  },
  redessociais: {
    label: 'Redes sociais',
    cat: 'Comunicação',
    icon: 'ti-brand-instagram',
    what: 'Plano de publicação nas redes.',
    how: 'Liste canais e datas.',
    fields: [
      { k: 'Canais', v: '', t: 'text' },
      { k: 'Publicação', v: '', t: 'date' }
    ]
  }
};
