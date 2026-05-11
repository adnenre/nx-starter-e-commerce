import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

vi.mock('@org/shop-feature-auth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: () => ({
    user: null,
    loading: false,
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  }),
  RegisterPage: () => <div>Register Page Mock</div>,
  LoginPage: () => <div>Login Page Mock</div>, // <-- Add this line
}));

vi.mock('@org/shop-feature-products', () => ({
  ProductList: () => <div>Mock Products</div>,
}));
vi.mock('@org/shop-feature-product-detail', () => ({
  ProductDetail: () => <div>Mock Detail</div>,
}));

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(container).toBeTruthy();
  });
});
