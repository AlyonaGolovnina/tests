import { useState, type FormEvent } from 'react';
import { getCartLines, cartTotalRub } from '../cart/selectors';
import type { CartQuantities } from '../cart/types';
import { CartQuantityControl } from '../components/CartQuantityControl';
import { formatRub } from '../data/format';
import { productImageUrl } from '../data/products';

type CartPageProps = {
  quantities: CartQuantities;
  onAddOne: (productId: string) => void;
  onRemoveOne: (productId: string) => void;
  onGoToCatalog: () => void;
  onOrderComplete: () => void;
};

export function CartPage({
  quantities,
  onAddOne,
  onRemoveOne,
  onGoToCatalog,
  onOrderComplete,
}: CartPageProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const lines = getCartLines(quantities);
  const totalRub = cartTotalRub(quantities);

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setOrderPlaced(true);
    setShowCheckout(false);
    onOrderComplete();
  }

  if (orderPlaced) {
    return (
      <main className="cart-page" data-testid="cart-page">
        <div className="checkout-success" data-testid="checkout-success">
          <p className="checkout-success__text">
            Спасибо за заказ! Оператор свяжется с вами в течение нескольких
            минут для подтверждения
          </p>
          <button
            type="button"
            className="cart-toggle cart-empty__btn"
            data-testid="back-to-catalog"
            onClick={onGoToCatalog}
          >
            Перейти в каталог
          </button>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="cart-page" data-testid="cart-page">
        <div className="cart-empty" data-testid="cart-empty">
          <p className="cart-empty__text">В корзине пока ничего нет.</p>
          <button
            type="button"
            className="cart-toggle cart-empty__btn"
            data-testid="back-to-catalog"
            onClick={onGoToCatalog}
          >
            Перейти в каталог
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page" data-testid="cart-page">
      <div className="cart-panel">
        <h2 className="cart-page__title">Ваша корзина</h2>
        <ul className="cart-list">
          {lines.map(({ product, quantity }) => {
            const lineTotal = product.priceRub * quantity;

            return (
              <li
                key={product.id}
                className="cart-line"
                data-testid={`cart-line-${product.id}`}
              >
                <img
                  src={productImageUrl(product.imageFile)}
                  alt=""
                  className="cart-line__thumb"
                  width={80}
                  height={60}
                />
                <div className="cart-line__info">
                  <p className="cart-line__name">{product.name}</p>
                  <p className="cart-line__unit">{product.priceLabel} / шт.</p>
                </div>
                <CartQuantityControl
                  product={product}
                  quantity={quantity}
                  compact
                  onAddOne={() => onAddOne(product.id)}
                  onRemoveOne={() => onRemoveOne(product.id)}
                />
                <p
                  className="cart-line__sum"
                  data-testid={`cart-line-total-${product.id}`}
                >
                  {formatRub(lineTotal)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="cart-summary">
          <p className="cart-summary__label">Итого</p>
          <p className="cart-summary__total" data-testid="cart-total">
            {formatRub(totalRub)}
          </p>
        </div>

        {showCheckout ? (
          <form
            className="checkout-form auth-form"
            data-testid="checkout-form"
            onSubmit={handleCheckoutSubmit}
          >
            <h3 className="checkout-form__title">Доставка</h3>
            <label className="auth-field">
              <span className="auth-label">Адрес</span>
              <input
                type="text"
                name="address"
                className="auth-input"
                data-testid="checkout-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
              />
            </label>
            <label className="auth-field">
              <span className="auth-label">Телефон</span>
              <input
                type="tel"
                name="phone"
                className="auth-input"
                data-testid="checkout-phone"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="cart-toggle auth-submit"
              data-testid="checkout-submit"
            >
              Подтвердить
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="cart-toggle cart-checkout-btn"
            data-testid="checkout-button"
            onClick={() => setShowCheckout(true)}
          >
            Оформить заказ
          </button>
        )}

        <button
          type="button"
          className="cart-toggle cart-summary__back"
          data-testid="back-to-catalog"
          onClick={onGoToCatalog}
        >
          Продолжить покупки
        </button>
      </div>
    </main>
  );
}
