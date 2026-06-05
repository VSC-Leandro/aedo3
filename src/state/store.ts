import { Field } from '../data/definitions';

export interface Card {
  id: string;
  type: string;
  x: number;
  y: number;
  fields: Field[];
}

export interface Connection {
  f: string; // from card ID
  t: string; // to card ID
}

export interface ModalState {
  mode: 'create' | 'edit' | 'import' | null;
  editId: string | null;
  cat: string;
  name: string;
  icon: string;
  color: string;
  fields: Field[];
}

interface AppState {
  cards: Card[];
  conns: Connection[];
  zoom: number;
  dragType: string | null;
  dragId: string | null;
  dragOX: number;
  dragOY: number;
  connMode: boolean;
  connFrom: string | null;
  mState: ModalState;
}

export const store: AppState = {
  cards: [],
  conns: [],
  zoom: 100,
  dragType: null,
  dragId: null,
  dragOX: 0,
  dragOY: 0,
  connMode: false,
  connFrom: null,
  mState: {
    mode: null,
    editId: null,
    cat: 'Atividades',
    name: '',
    icon: 'ti-cards',
    color: '#534AB7',
    fields: []
  }
};
