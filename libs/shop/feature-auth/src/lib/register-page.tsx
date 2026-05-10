import React, { useState } from 'react';
import { useAuth } from './auth-context';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    try {
      await register({ name, email, password });
      // If newsletter is checked, we could call an extra API here (optional)
      window.location.href = '/products';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an account</h2>
        <p className="subtitle">Join our shop and start shopping today!</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
              />
              I agree to the{' '}
              <a href="/terms" target="_blank">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.currentTarget.checked)}
              />
              Yes, I’d like to receive exclusive offers and news via email
            </label>
          </div>

          <button type="submit" className="register-btn">
            Sign up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>

      <style>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background: #f5f5f5;
          padding: 1rem;
        }
        .register-card {
          background: white;
          max-width: 480px;
          width: 100%;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .subtitle {
          color: #666;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .checkbox-group {
          margin: 1rem 0;
        }
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #555;
          cursor: pointer;
        }
        .register-btn {
          width: 100%;
          background-color: #2c7da0;
          color: white;
          border: none;
          padding: 0.75rem;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.2s;
        }
        .register-btn:hover {
          background-color: #1f5e7a;
        }
        .error-message {
          background: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }
        a {
          color: #2c7da0;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
