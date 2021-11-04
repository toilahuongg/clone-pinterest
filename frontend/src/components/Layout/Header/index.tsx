import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import Login from 'src/components/Login';
import Register from 'src/components/Register';
import useAuth from 'src/hooks/useAuth';

import Modal from '../Modal';
import styles from './header.module.scss';

const Header: React.FC = () => {
  const { isAuth, setToken } = useAuth();

  const [modalRegisterActive, setModalRegisterActive] = useState<boolean>(false);
  const toggleModalRegisterActive = () => setModalRegisterActive(!modalRegisterActive);

  const [modalLoginActive, setModalLoginActive] = useState<boolean>(false);
  const toggleModalLoginActive = () => setModalLoginActive(!modalLoginActive);

  const handleLogout = () => {
    setToken('');
    window.location.href = '/';
  };
  return (
    <header className={styles.header}>
      <ul className={styles.navbar}>
        <li className={styles.logo}>
          <NavLink to="/">
            <img src="/logo.png" alt="logo" />
          </NavLink>
        </li>
        <li className={styles.home}>
          <NavLink to="/playground">Trang chủ</NavLink>
        </li>
        <li className={styles.search}>
          <input type="text" placeholder="Tìm kiếm" />
          <span>
            <FiSearch />
          </span>
        </li>
        <li className={styles.user}>
          <div className={styles.avatar}>
            <FaUser size="24" color="rgb(108 108 108)" />
          </div>
          <div className={styles.menu}>
            <ul>
              {isAuth ? (
                <>
                  <li onClick={handleLogout} role="presentation">
                    Đăng xuất
                  </li>
                </>
              ) : (
                <>
                  <li className={styles.main}> Bạn đã có tài khoản chưa?</li>
                  <li onClick={() => toggleModalRegisterActive()} role="presentation">
                    Đăng ký
                  </li>
                  <li onClick={() => toggleModalLoginActive()} role="presentation">
                    Đăng nhập
                  </li>
                </>
              )}
            </ul>
          </div>
        </li>
      </ul>
      {!isAuth && (
        <>
          <Modal isShow={modalRegisterActive} onClose={toggleModalRegisterActive}>
            <Modal.Header> Đăng ký </Modal.Header>
            <Modal.Body>
              <Register onClose={toggleModalRegisterActive} openLogin={toggleModalLoginActive} />
            </Modal.Body>
          </Modal>
          <Modal isShow={modalLoginActive} onClose={toggleModalLoginActive}>
            <Modal.Header> Đăng Nhập </Modal.Header>
            <Modal.Body>
              <Login onClose={toggleModalLoginActive} openRegister={toggleModalRegisterActive} />
            </Modal.Body>
          </Modal>
        </>
      )}
    </header>
  );
};
export default observer(Header);
