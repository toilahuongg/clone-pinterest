import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <Router>
      <header className={styles.header}>
        <ul className={styles.navbar}>
          <li className={styles.logo}>
            <Link to="/">
              <img src="/logo.png" alt="logo" />
            </Link>
          </li>
          <li className={styles.home}>
            <Link to="/">Trang chủ</Link>
          </li>
          <li className={styles.search}>
            <input type="text" placeholder="Tìm kiếm" />
            <span>
              <FiSearch />
            </span>
          </li>
          <li className={styles.user}>
            <div className={styles.avatar}>
              <img src="/default-avatar.png" alt="avatar" />
            </div>
          </li>
        </ul>
      </header>
    </Router>
  );
};
export default Header;
