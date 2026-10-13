export type Product = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 'notebook',
    name: 'QA Notebook',
    priceLabel: '990 ₽',
    description: 'Блокнот для чек-листов и баг-репортов.',
  },
  {
    id: 'mug',
    name: 'Automation Mug',
    priceLabel: '1 290 ₽',
    description: 'Кружка «Сначала тест, потом прод».',
  },
  {
    id: 'stickers',
    name: 'Playwright Stickers',
    priceLabel: '490 ₽',
    description: 'Стикеры с data-testid для хорошего настроения.',
  },
];
