import React, { useState } from 'react';
import { useAuth } from './auth-context';
import styles from './register-page.module.css';

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
      window.location.href = '/products';
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>
          Join our shop and start shopping today!
        </p>

        {error && (
          <div className={styles.error} data-testid="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.currentTarget.checked)}
                data-testid="terms-checkbox"
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

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.currentTarget.checked)}
              />
              Yes, I’d like to receive exclusive offers and news via email
            </label>
          </div>

          <button type="submit" className={styles.button}>
            Sign up
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};
