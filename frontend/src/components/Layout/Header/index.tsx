import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React, { useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Login from 'src/components/Login';
import Register from 'src/components/Register';
import useAuth from 'src/hooks/useAuth';
import useStore from 'src/stores';
import { usePins } from 'src/stores/pin';

import Dropdown from '../Dropdown';
import List from '../List';
import Modal from '../Modal';
import styles from './header.module.scss';

const Header: React.FC = () => {
  const history = useHistory();
  const { isAuth, removeToken } = useAuth();
  const { userModel } = useStore();
  const { detailUser } = userModel;
  const [isActive, setActive] = useState<boolean>(false);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const timeTypingRef = useRef<any>(null);
  const { setTitle } = usePins();
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

  const handleChangeSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
    if (timeTypingRef.current) clearTimeout(timeTypingRef.current);
    timeTypingRef.current = setTimeout(() => {
      setTitle(e.target.value);
      history.push('/');
    }, 300);
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
          <input value={searchTitle} onChange={handleChangeSearchTitle} type="text" placeholder="Tìm kiếm" />
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
