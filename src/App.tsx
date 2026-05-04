import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Home          from './pages/Home';
import ProductList   from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Login         from './pages/Login';
import Register      from './pages/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 min
    },
  },
});

// ── Route protégée : redirige vers /login si non connecté
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/"          element={<Home />} />
          <Route path="/products"  element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Routes protégées */}
          <Route path="/cart" element={
            <PrivateRoute><Cart /></PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}