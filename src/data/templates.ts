import { SETORES, PRINCIPIOS, ASPECTOS, TEMAS } from './constants';
import { Field } from './definitions';

export interface TemplateCard {
  key: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  what: string;
  how: string;
  fields: Field[];
}

export interface Template {
  name: string;
  desc: string;
  icon: string;
  color: string;
  meta: string;
  project: {
    title: string;
    desc: string;
  };
  cards: TemplateCard[];
}

export const TEMPLATES: Record<string, Template> = {
  fib16: {
    name: 'FIB16 — Proposta de Workshop',
    desc: 'Formulário completo de submissão de workshop para o 16º Fórum da Internet no Brasil e Pré-IGF 2025. As 6 partes já estruturadas em cartas.',
    icon: 'ti-forms',
    color: '#2F4E9E',
    meta: '18 cartas · 6 partes',
    project: {
      title: 'FIB16 — Proposta de Workshop',
      desc: 'Submissão de workshop para o 16º Fórum da Internet no Brasil. Prazo: 18/08/2025. Avaliação anônima — não inserir dados de identificação nos campos de conteúdo.'
    },
    cards: [
      {
        key: 'fib_contato1', label: '1A · Contato Responsável 1', icon: 'ti-user-check', x: 30, y: 30,
        what: 'Pessoa principal de contato com a organização do FIB16. Dados importados da plataforma Cursos e Eventos.',
        how: 'Preencha nome, e-mail e telefone. Será o canal direto com a equipe organizadora.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Telefone com DDD', v: '', t: 'text' }]
      },
      {
        key: 'fib_contato2', label: '1B · Contato Responsável 2', icon: 'ti-user-plus', x: 30, y: 255,
        what: 'Segundo contato responsável, copiado em toda comunicação com o FIB.',
        how: 'Obrigatório. Informe nome, e-mail e telefone válidos.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Telefone com DDD', v: '', t: 'text' }]
      },
      {
        key: 'fib_proponente', label: '2A · Proponente', icon: 'ti-bulb', x: 245, y: 30,
        what: 'Pessoa ou organização que concebe e elabora a proposta. Setor e região contam na avaliação.',
        how: 'Indique tipo, nome, estado, cidade e setor. Marque se há co-proponente.',
        fields: [{ k: 'Tipo', v: '', t: 'select', opts: ['Pessoa', 'Organização'] }, { k: 'Nome', v: '', t: 'text' }, { k: 'Estado (UF)', v: '', t: 'text' }, { k: 'Cidade', v: '', t: 'text' }, { k: 'Setor', v: '', t: 'select', opts: SETORES }, { k: 'Tem co-proponente?', v: '', t: 'select', opts: ['Sim', 'Não'] }]
      },
      {
        key: 'fib_coproponente', label: '2B · Co-proponente (opcional)', icon: 'ti-users', x: 245, y: 355,
        what: 'Pessoa ou organização que colabora na concepção. Só preencher se houver co-proponente.',
        how: 'Mesmos campos do proponente.',
        fields: [{ k: 'Tipo', v: '', t: 'select', opts: ['Pessoa', 'Organização'] }, { k: 'Nome', v: '', t: 'text' }, { k: 'Estado (UF)', v: '', t: 'text' }, { k: 'Cidade', v: '', t: 'text' }, { k: 'Setor', v: '', t: 'select', opts: SETORES }]
      },
      {
        key: 'fib_titulo', label: '3 · Título do Workshop', icon: 'ti-heading', x: 460, y: 30,
        what: 'Título da proposta, até 100 caracteres.', how: 'Sem identificar proponente. Avaliação é anônima.',
        fields: [{ k: 'Título (máx. 100)', v: '', t: 'text' }]
      },
      {
        key: 'fib_resumo', label: '3 · Resumo', icon: 'ti-file-text', x: 460, y: 160,
        what: 'Resumo do workshop, até 500 caracteres.', how: 'Descreva a proposta de forma concisa.',
        fields: [{ k: 'Resumo (máx. 500)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_objetivos', label: '3 · Objetivos e conteúdos', icon: 'ti-target', x: 460, y: 320,
        what: 'Objetivos do workshop e conteúdos discutidos, até 2000 caracteres.', how: 'Detalhe o que será abordado.',
        fields: [{ k: 'Objetivos (máx. 2000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_diversidade', label: '3 · Diversidade de perspectivas', icon: 'ti-arrows-shuffle', x: 675, y: 30,
        what: 'Como a proposta contempla perspectivas diversas, inclusive divergentes. Até 1000 caracteres.', how: 'Explique a pluralidade de olhares.',
        fields: [{ k: 'Diversidade (máx. 1000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_relevancia', label: '3 · Relevância (Governança)', icon: 'ti-world', x: 675, y:190,
        what: 'Por que o workshop é relevante para o debate de governança da Internet. Até 2000 caracteres.', how: 'Justifique a relevância.',
        fields: [{ k: 'Relevância (máx. 2000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_aspectos', label: '3 · Aspectos de diversidade', icon: 'ti-checkbox', x: 675, y: 350,
        what: 'Selecione até 3 aspectos de diversidade relevantes.', how: 'Marque no máximo 3.',
        fields: [{ k: 'Aspectos (até 3)', v: [], t: 'multi', opts: ASPECTOS }]
      },
      {
        key: 'fib_integracao', label: '3 · Integração da diversidade', icon: 'ti-puzzle', x: 890, y: 30,
        what: 'Como a proposta integrará os aspectos de diversidade. Até 1000 caracteres.', how: 'Justifique a integração.',
        fields: [{ k: 'Integração (máx. 1000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_metodologia', label: '3 · Metodologia multissetorial', icon: 'ti-sitemap', x: 890, y: 190,
        what: 'Como será estruturada a participação dos palestrantes. Lembre: workshop dura 90 min. Até 1000 caracteres.', how: 'Indique pergunta orientadora, tempo por palestrante, blocos.',
        fields: [{ k: 'Metodologia (máx. 1000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_engajamento', label: '3 · Engajamento da audiência', icon: 'ti-broadcast', x: 890, y: 350,
        what: 'Como envolver participantes presenciais e remotos. Até 1000 caracteres.', how: 'Cite redes sociais, hashtags, chat etc.',
        fields: [{ k: 'Engajamento (máx. 1000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_resultados', label: '3 · Resultados pretendidos', icon: 'ti-flag', x: 890, y: 510,
        what: 'Resultados esperados para o workshop. Até 1000 caracteres.', how: 'Descreva o que se espera alcançar.',
        fields: [{ k: 'Resultados (máx. 1000)', v: '', t: 'longtext' }]
      },
      {
        key: 'fib_principio', label: '4 · Princípio do Decálogo', icon: 'ti-scale', x: 1105, y: 30,
        what: 'Princípio do Decálogo CGI.br com que o workshop mais se identifica.', how: 'Escolha um.',
        fields: [{ k: 'Princípio', v: '', t: 'select', opts: PRINCIPIOS }]
      },
      {
        key: 'fib_temas', label: '4 · Temas do workshop', icon: 'ti-tags', x: 1105, y: 160,
        what: 'Indique de 1 a 3 temas relacionados ao workshop (de 77 temas em 11 macrotemas).', how: 'Marque até 3.',
        fields: [{ k: 'Temas (1 a 3)', v: [], t: 'multi', opts: TEMAS }]
      },
      {
        key: 'fib_palestrante_gov', label: '5A · Palestrante — Governamental', icon: 'ti-building-bank', x: 1320, y: 30,
        what: 'Palestrante do setor governamental (obrigatório 1 de cada sector).', how: 'Nome, e-mail e indicação de apoio.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: 'Governamental', t: 'select', opts: SETORES }, { k: 'Indicar para apoio?', v: '', t: 'select', opts: ['Sim', 'Não'] }]
      },
      {
        key: 'fib_palestrante_emp', label: '5A · Palestrante — Empresarial', icon: 'ti-briefcase', x: 1320, y: 255,
        what: 'Palestrante do setor empresarial.', how: 'Nome, e-mail e indicação de apoio.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: 'Empresarial', t: 'select', opts: SETORES }, { k: 'Indicar para apoio?', v: '', t: 'select', opts: ['Sim', 'Não'] }]
      },
      {
        key: 'fib_palestrante_ts', label: '5A · Palestrante — Terceiro Setor', icon: 'ti-heart-handshake', x: 1320, y: 480,
        what: 'Palestrante do terceiro setor.', how: 'Nome, e-mail e indicação de apoio.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: 'Terceiro Setor', t: 'select', opts: SETORES }, { k: 'Indicar para apoio?', v: '', t: 'select', opts: ['Sim', 'Não'] }]
      },
      {
        key: 'fib_palestrante_cc', label: '5A · Palestrante — Com. Científica', icon: 'ti-microscope', x: 1320, y: 705,
        what: 'Palestrante da comunidade científica e tecnológica.', how: 'Nome, e-mail e indicação de apoio.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: 'Comunidade Científica e Tecnológica', t: 'select', opts: SETORES }, { k: 'Indicar para apoio?', v: '', t: 'select', opts: ['Sim', 'Não'] }]
      },
      {
        key: 'fib_moderador', label: '5B · Moderador(a)', icon: 'ti-user-cog', x: 1535, y: 30,
        what: 'Uma pessoa responsável pela moderação (obrigatório).', how: 'Nome, e-mail e setor.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: '', t: 'select', opts: SETORES }]
      },
      {
        key: 'fib_relator', label: '5C · Relator(a)', icon: 'ti-notes', x: 1535, y: 255,
        what: 'Uma pessoa responsável pela relatoria (obrigatório). Envia o relatório até 7 dias após o FIB16.', how: 'Nome, e-mail e setor.',
        fields: [{ k: 'Nome', v: '', t: 'text' }, { k: 'E-mail', v: '', t: 'text' }, { k: 'Setor', v: '', t: 'select', opts: SETORES }]
      }
    ]
  }
};
