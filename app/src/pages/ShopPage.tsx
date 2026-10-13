import type { CartQuantities } from '../cart/types';
import { ShopShell, type ShopView } from '../components/ShopShell';
import { CartPage } from './CartPage';
import { CatalogPage } from './CatalogPage';

type ShopPageProps = {
  username: string;
  view: ShopView;
  quantities: CartQuantities;
  onLogout: () => void;
  onNavigate: (view: ShopView) => void;
  onAddOne: (productId: string) => void;
  onRemoveOne: (productId: string) => void;
  onClearCart: () => void;
};

export function ShopPage({
  username,
  view,
  quantities,
  onLogout,
  onNavigate,
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
          onAddOne={onAddOne}
          onRemoveOne={onRemoveOne}
          onGoToCatalog={() => onNavigate('catalog')}
          onOrderComplete={onClearCart}
        />
      )}
    </ShopShell>
  );
}
