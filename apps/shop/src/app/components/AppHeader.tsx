import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@org/shop-feature-auth';
import styles from './AppHeader.module.css';

export function AppHeader() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.appTitle}>Nx Shop Demo</h1>
        <div className={styles.userArea}>
          {user ? (
            <div className={styles.avatarDropdown} ref={dropdownRef}>
              <div className={styles.avatar} onClick={toggleDropdown}>
                {getUserInitials()}
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => (window.location.href = '/cart')}
                  >
                    🛒 Cart
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${styles.logout}`}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authLinks}>
              <a href="/login">Login</a> | <a href="/register">Register</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
