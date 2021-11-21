import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import Login from 'src/components/Login';
import Register from 'src/components/Register';
import useAuth from 'src/hooks/useAuth';
import useStore from 'src/stores';

import Dropdown from '../Dropdown';
import List from '../List';
import Modal from '../Modal';
import styles from './header.module.scss';

const Header: React.FC = () => {
  const { isAuth, removeToken } = useAuth();
  const { userModel } = useStore();
  const { detailUser } = userModel;
  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);

  const [modalRegisterActive, setModalRegisterActive] = useState<boolean>(false);
  const toggleModalRegisterActive = () => setModalRegisterActive(!modalRegisterActive);

  const [modalLoginActive, setModalLoginActive] = useState<boolean>(false);
  const toggleModalLoginActive = () => {
    applySnapshot(detailUser, {});
    setModalLoginActive(!modalLoginActive);
  };

  const handleLogout = async () => {
    removeToken();
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
          <NavLink to="/">Trang chủ</NavLink>
        </li>
        <li className={styles.search}>
          <input type="text" placeholder="Tìm kiếm" />
          <span>
            <FiSearch />
          </span>
        </li>
        <li className={styles.user}>
          <Dropdown
            isShow={isActive}
            align="bottomRight"
            activator={
              <div className={styles.avatar} onClick={toggleActive}>
                {detailUser?.avatar ? (
                  <img
                    src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${detailUser?.avatar}`}
                    alt="avatar"
                  />
                ) : (
                  <FaUser size="24" color="rgb(108 108 108)" />
                )}
              </div>
            }
            onClose={toggleActive}
          >
            <List>
              {isAuth ? (
                <>
                  <List.Item main> {detailUser.fullname} </List.Item>
                  <List.Item>
                    <Link to="/profile"> Trang cá nhân </Link>
                  </List.Item>
                  <List.Item>
                    <Link to="/settings"> Cài đặt </Link>
                  </List.Item>
                  <List.Item onClick={handleLogout} role="presentation">
                    Đăng xuất
                  </List.Item>
                </>
              ) : (
                <>
                  <List.Item main> Bạn đã có tài khoản chưa?</List.Item>
                  <List.Item onClick={() => toggleModalRegisterActive()} role="presentation">
                    Đăng ký
                  </List.Item>
                  <List.Item onClick={() => toggleModalLoginActive()} role="presentation">
                    Đăng nhập
                  </List.Item>
                </>
              )}
            </List>
          </Dropdown>
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
