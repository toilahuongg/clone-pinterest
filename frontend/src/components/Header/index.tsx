import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <Router>
      <header className={styles.header}>
        <nav>
          <ul className={styles.menu}>
            <li className={styles.logo}>
              <Link to="/">
                <img src="/toilahuongg.png" alt="logo" />
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
            <li style={{ width: '10%' }}> Login </li>
            <li style={{ width: '10%' }}> Register </li>
          </ul>
        </nav>
      </header>
    </Router>
  );
};
export default Header;
