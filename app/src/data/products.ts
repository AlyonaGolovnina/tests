import { formatRub } from './format';

export type Product = {
  id: string;
  name: string;
  priceRub: number;
  priceLabel: string;
  description: string;
  imageFile: string;
};

function product(
  id: string,
  name: string,
  priceRub: number,
  description: string,
  imageFile: string,
): Product {
  return {
    id,
    name,
    priceRub,
    priceLabel: formatRub(priceRub),
    description,
    imageFile,
  };
}

export const products: Product[] = [
  product(
    'notebook',
    'Кофе «Регрессо»',
    130,
    'Гарантированно вкусный, без дефектов.',
    'regresso.jpg',
  ),
  product(
    'mug',
    'Кофе «Интегро»',
    199,
    'Модули вкуса сошлись идеально.',
    'integrro.jpg',
  ),
  product(
    'stickers',
    'Кофе «Смокачино 200 ОК»',
    288,
    'Кофе отвечает. Можно углубляться.',
    'smokachino.jpg',
  ),
];

export function productImageUrl(imageFile: string): string {
  return `${import.meta.env.BASE_URL}products/${imageFile}`;
}
