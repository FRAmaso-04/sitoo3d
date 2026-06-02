export interface Drop {
  code: string;
  name: string;
  model: string;
  garment: string;
  accent: string;
}

export const DROPS: Drop[] = [
  {
    code:    'DROP 01',
    name:    'THE RED PINE',
    model:   '/models/drop-01.glb',
    garment: '#161616',
    accent:  '#CC1111',
  },
  {
    code:    'DROP 02',
    name:    'NORTHWIND',
    model:   '/models/drop-02.glb',
    garment: '#14181E',
    accent:  '#6FA8C7',
  },
  {
    code:    'DROP 03',
    name:    'EMBER',
    model:   '/models/drop-03.glb',
    garment: '#1E150F',
    accent:  '#D98441',
  },
];
