import React, { useState } from 'react';
import { useAuth } from './auth-context';
import styles from './login-page.module.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      window.location.href = '/products';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Log in to your account</h2>
        {error && (
          <div className={styles.error} data-testid="login-error">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Log in
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};
