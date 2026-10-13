import { CartQuantityControl } from '../components/CartQuantityControl';
import type { CartQuantities } from '../cart/types';
import { productImageUrl, products } from '../data/products';

type CatalogPageProps = {
  quantities: CartQuantities;
  onAddOne: (productId: string) => void;
  onRemoveOne: (productId: string) => void;
};

export function CatalogPage({
  quantities,
  onAddOne,
  onRemoveOne,
}: CatalogPageProps) {
  return (
    <>
      <a className="skip-link" href="#product-catalog">
        К каталогу
      </a>
      <main
        id="product-catalog"
        className="catalog"
        data-testid="product-catalog"
      >
        {products.map((product) => {
          const quantity = quantities[product.id] ?? 0;
          const inCart = quantity > 0;

          return (
            <article
              key={product.id}
              className={`card${inCart ? ' card--in-cart' : ''}`}
              data-testid={`product-card-${product.id}`}
            >
              <div className="card-media">
                <img
                  src={productImageUrl(product.imageFile)}
                  alt={product.name}
                  className="card-image"
                  data-testid={`product-image-${product.id}`}
                  loading="lazy"
                  width={320}
                  height={240}
                />
              </div>
              <h2 data-testid={`product-name-${product.id}`}>{product.name}</h2>
              <p className="price" data-testid={`product-price-${product.id}`}>
                {product.priceLabel}
              </p>
              <p
                className="desc"
                data-testid={`product-description-${product.id}`}
              >
                {product.description}
              </p>
              <CartQuantityControl
                product={product}
                quantity={quantity}
                onAddOne={() => onAddOne(product.id)}
                onRemoveOne={() => onRemoveOne(product.id)}
              />
            </article>
          );
        })}
      </main>
    </>
  );
}
