import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@org/shop-shared-ui';
import { RegisterPage } from '@org/shop-feature-auth'; // direct import

const ProductList = lazy(() =>
  import('@org/shop-feature-products').then((m) => ({
    default: m.ProductList,
  })),
);
const ProductDetail = lazy(() =>
  import('@org/shop-feature-product-detail').then((m) => ({
    default: m.ProductDetail,
  })),
);

export function App() {
  return (
    <div className="app">
      <header className="app-header">...</header>
      <main className="app-main">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
export default App;
