import type { Product } from '../data/products';

type CartQuantityControlProps = {
  product: Product;
  quantity: number;
  onAddOne: () => void;
  onRemoveOne: () => void;
  compact?: boolean;
};

export function CartQuantityControl({
  product,
  quantity,
  onAddOne,
  onRemoveOne,
  compact = false,
}: CartQuantityControlProps) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        className="cart-toggle"
        data-testid={`add-to-cart-${product.id}`}
        onClick={onAddOne}
      >
        В корзину
      </button>
    );
  }

  return (
    <div
      className={`cart-stepper${compact ? ' cart-stepper--compact' : ''}`}
      data-testid={`cart-controls-${product.id}`}
    >
      <button
        type="button"
        className="cart-stepper__btn cart-stepper__btn--minus"
        data-testid={`remove-from-cart-${product.id}`}
        aria-label={`Уменьшить количество: ${product.name}`}
        onClick={onRemoveOne}
      >
        −
      </button>
      <span
        className="cart-stepper__qty"
        data-testid={`cart-quantity-${product.id}`}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        className="cart-stepper__btn cart-stepper__btn--plus"
        data-testid={`add-to-cart-${product.id}`}
        aria-label={`Увеличить количество: ${product.name}`}
        onClick={onAddOne}
      >
        +
      </button>
    </div>
  );
}
