import type { CartQuantities } from '../cart/types';
import { ShopShell, type ShopView } from '../components/ShopShell';
import type { CheckoutUiState } from '../shop/uiStorage';
import { CartPage } from './CartPage';
import { CatalogPage } from './CatalogPage';

type ShopPageProps = {
  username: string;
  view: ShopView;
  quantities: CartQuantities;
  checkoutUi: CheckoutUiState;
  onCheckoutUiChange: (next: CheckoutUiState) => void;
  onLogout: () => void;
  onNavigate: (view: ShopView) => void;
  onGoToCatalog: () => void;
  onAddOne: (productId: string) => void;
  onRemoveOne: (productId: string) => void;
  onClearCart: () => void;
};

export function ShopPage({
  username,
  view,
  quantities,
  checkoutUi,
  onCheckoutUiChange,
  onLogout,
  onNavigate,
  onGoToCatalog,
  onAddOne,
  onRemoveOne,
  onClearCart,
}: ShopPageProps) {
  return (
    <ShopShell
      username={username}
      view={view}
      quantities={quantities}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      {view === 'catalog' ? (
        <CatalogPage
          quantities={quantities}
          onAddOne={onAddOne}
          onRemoveOne={onRemoveOne}
        />
      ) : (
        <CartPage
          quantities={quantities}
          checkoutUi={checkoutUi}
          onCheckoutUiChange={onCheckoutUiChange}
          onAddOne={onAddOne}
          onRemoveOne={onRemoveOne}
          onGoToCatalog={onGoToCatalog}
          onOrderComplete={onClearCart}
        />
      )}
    </ShopShell>
  );
}
