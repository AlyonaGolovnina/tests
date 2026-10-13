import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { writeSession } from './auth/session';
import { writeCart } from './cart/storage';
import { DEMO_PASSWORD, DEMO_USERNAME } from './data/demoAuth';
import { writeCheckoutUi, writeShopView } from './shop/uiStorage';
import {
  addProductToCart,
  cartStatusLabel,
  firstProductId,
  goToCatalogFromTitle,
  loginAs,
  loginWithDemoUser,
  openCart,
  placeOrder,
  renderApp,
} from './test/shopTestHelpers';

describe('QA Coffee Shop — интеграционные сценарии (не E2E)', () => {
  describe('1. Авторизация', () => {
    it('успешный вход показывает каталог и приветствие', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);

      expect(screen.getByTestId('product-catalog')).toBeInTheDocument();
      expect(screen.getByTestId('user-greeting')).toHaveTextContent(DEMO_USERNAME);
    });

    it('неверные данные показывают ошибку и оставляют на экране входа', async () => {
      const { user } = await renderApp();
      await loginAs(user, DEMO_USERNAME, 'not-a-password');

      expect(screen.getByTestId('login-error')).toHaveTextContent(
        'Неверный логин или пароль',
      );
      expect(screen.queryByTestId('product-catalog')).not.toBeInTheDocument();
    });

    it('неверный логин не пускает в магазин', async () => {
      const { user } = await renderApp();
      await loginAs(user, 'hacker', DEMO_PASSWORD);

      expect(screen.getByTestId('login-error')).toBeInTheDocument();
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('не восстанавливает сессию с неизвестным пользователем', async () => {
      writeSession({ username: 'someone_else' });
      await renderApp();

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('2. Разлогин', () => {
    it('выход возвращает на форму входа и сбрасывает UI', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await user.click(screen.getByTestId('logout-button'));

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('user-greeting')).not.toBeInTheDocument();
    });

    it('после выхода повторный вход начинается с пустой корзины', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await user.click(screen.getByTestId('logout-button'));
      await loginWithDemoUser(user);

      expect(cartStatusLabel()).toHaveTextContent('Корзина пуста');
    });
  });

  describe('3. Проверка счетчика корзины', () => {
    it('показывает «Корзина пуста» без товаров', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);

      expect(cartStatusLabel()).toHaveTextContent('Корзина пуста');
    });

    it('обновляет бейдж при добавлении и уменьшении', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      const productId = firstProductId();

      await addProductToCart(user, productId);
      expect(cartStatusLabel()).toHaveTextContent('В корзине: 1');

      await user.click(screen.getByTestId(`add-to-cart-${productId}`));
      expect(cartStatusLabel()).toHaveTextContent('В корзине: 2');

      await user.click(screen.getByTestId(`remove-from-cart-${productId}`));
      expect(cartStatusLabel()).toHaveTextContent('В корзине: 1');

      await user.click(screen.getByTestId(`remove-from-cart-${productId}`));
      expect(cartStatusLabel()).toHaveTextContent('Корзина пуста');
    });
  });

  describe('4. Добавление в корзину', () => {
    it('показывает степпер и количество после «В корзину»', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      const productId = firstProductId();

      expect(screen.getByTestId(`add-to-cart-${productId}`)).toBeInTheDocument();
      await addProductToCart(user, productId);

      expect(screen.getByTestId(`cart-controls-${productId}`)).toBeInTheDocument();
      expect(screen.getByTestId(`cart-quantity-${productId}`)).toHaveTextContent('1');
      expect(screen.getByTestId(`product-card-${productId}`)).toHaveClass('card--in-cart');
    });

    it('считает сумму строки и итог в корзине', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      const productId = firstProductId();

      await addProductToCart(user, productId);
      await user.click(screen.getByTestId(`add-to-cart-${productId}`));
      await openCart(user);

      expect(screen.getByTestId(`cart-line-total-${productId}`)).toHaveTextContent(
        '260 ₽',
      );
      expect(screen.getByTestId('cart-total')).toHaveTextContent('260 ₽');
    });
  });

  describe('5. Сохранение состояния при обновлении страницы', () => {
    it('восстанавливает корзину, экран и черновик оформления', async () => {
      const { user, unmount } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);
      await user.click(screen.getByTestId('checkout-button'));
      await user.type(screen.getByTestId('checkout-address'), 'ул. Сохранённая, 10');

      unmount();
      render(<App />);

      expect(await screen.findByTestId('cart-page')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-address')).toHaveValue('ул. Сохранённая, 10');
      expect(screen.getByTestId(`cart-line-${firstProductId()}`)).toBeInTheDocument();
    });

    it('восстанавливает сессию и корзину из sessionStorage без повторного входа', async () => {
      writeSession({ username: DEMO_USERNAME });
      writeCart(DEMO_USERNAME, { mug: 1 });
      writeShopView(DEMO_USERNAME, 'cart');

      render(<App />);

      expect(await screen.findByTestId('cart-page')).toBeInTheDocument();
      expect(screen.getByTestId('user-greeting')).toHaveTextContent(DEMO_USERNAME);
      expect(screen.getByTestId('cart-line-mug')).toBeInTheDocument();
      expect(cartStatusLabel()).toHaveTextContent('В корзине: 1');
    });

    it('показывает экран «спасибо за заказ» после перезагрузки', async () => {
      writeSession({ username: DEMO_USERNAME });
      writeCart(DEMO_USERNAME, {});
      writeShopView(DEMO_USERNAME, 'cart');
      writeCheckoutUi(DEMO_USERNAME, {
        showCheckout: false,
        address: 'ул. Заказ, 1',
        phone: '+7 900 000-00-00',
        orderPlaced: true,
      });

      render(<App />);

      expect(await screen.findByTestId('checkout-success')).toBeInTheDocument();
    });
  });

  describe('6. Оформление заказа', () => {
    it('открывает форму доставки и подтверждает заказ', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);

      await user.click(screen.getByTestId('checkout-button'));
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();

      await placeOrder(user);

      expect(screen.getByTestId('checkout-success')).toHaveTextContent(
        'Спасибо за заказ!',
      );
      expect(cartStatusLabel()).toHaveTextContent('Корзина пуста');
    });

    it('не отправляет заказ с пустыми полями (HTML validation)', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);
      await user.click(screen.getByTestId('checkout-button'));

      const form = screen.getByTestId('checkout-form');
      await user.click(within(form).getByTestId('checkout-submit'));

      expect(screen.queryByTestId('checkout-success')).not.toBeInTheDocument();
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    });

    it('на пустой корзине нет кнопки оформления', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await openCart(user);

      expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('checkout-button')).not.toBeInTheDocument();
    });
  });

  describe('7. Возврат в каталог', () => {
    it('по клику на заголовок из корзины', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);
      await goToCatalogFromTitle(user);

      expect(screen.getByTestId('product-catalog')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-page')).not.toBeInTheDocument();
    });

    it('по кнопке «Продолжить покупки»', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);

      await user.click(screen.getByTestId('back-to-catalog'));
      expect(screen.getByTestId('product-catalog')).toBeInTheDocument();
    });

    it('с экрана успешного заказа сбрасывает оформление', async () => {
      const { user } = await renderApp();
      await loginWithDemoUser(user);
      await addProductToCart(user);
      await openCart(user);
      await placeOrder(user);

      await user.click(screen.getByTestId('back-to-catalog'));

      expect(screen.getByTestId('product-catalog')).toBeInTheDocument();
      await openCart(user);
      expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('checkout-success')).not.toBeInTheDocument();
    });
  });
});
