export type Product = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  imageFile: string;
};

export const products: Product[] = [
  {
    id: 'notebook',
    name: 'Кофе «Регрессо»',
    priceLabel: '130 ₽',
    description: 'Гарантированно вкусный, без дефектов.',
    imageFile: 'regresso.jpg',
  },
  {
    id: 'mug',
    name: 'Кофе «Интегро»',
    priceLabel: '199 ₽',
    description: 'Модули вкуса сошлись идеально.',
    imageFile: 'integrro.jpg',
  },
  {
    id: 'stickers',
    name: 'Кофе «Смокачино 200 ОК»',
    priceLabel: '288 ₽',
    description: 'Кофе отвечает. Можно углубляться.',
    imageFile: 'smokachino.jpg',
  },
];

export function productImageUrl(imageFile: string): string {
  return `${import.meta.env.BASE_URL}products/${imageFile}`;
}
