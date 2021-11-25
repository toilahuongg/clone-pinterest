import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FaUser, FaPen } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import bbcodeToHTML from 'src/helpers/bbcode';
import useStore from 'src/stores';
import { useCollections } from 'src/stores/collection';
import { usePins } from 'src/stores/pin';
import { useUsers } from 'src/stores/user';

import ListCollection from '../Collection';
import ModalDeleteCollection from '../Collection/ModalDeleteCollection';
import ModalFormCollection from '../Collection/ModalFormCollection';
import Button from '../Layout/Button';
import Dropdown from '../Layout/Dropdown';
import List from '../Layout/List';
import ModalFormPin from '../Pin/ModalFormPin';
import styles from './profile.module.scss';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { userModel } = useStore();
  const { detailUser } = userModel;
  const { getUser, detailUser: user } = useUsers();
  useEffect(() => {
    getUser(username || 'info', true);
  }, [username]);
  const isYourself = detailUser.id === user?.id;
  const { toggleModalShowFormCollection, detailCollection } = useCollections();
  const { detailPin, toggleModalShowFormPin } = usePins();
  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    document.title = user.isLoading ? 'Loading...' : detailUser.fullname ? detailUser.fullname : 'Trang cá nhân';
  }, [detailUser.fullname, user.isLoading]);

  return user.isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.profile}>
      <div
        className={styles.cover}
        style={{
          backgroundImage: user?.cover
            ? `url(${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user.cover})`
            : '#ddd',
        }}
      >
        <div className={styles.avatar}>
          {user?.avatar ? (
            <img
              src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user.avatar}`}
              alt={`avatar of ${username}`}
            />
          ) : (
            <FaUser size="48" color="rgb(108 108 108)" />
          )}
        </div>
      </div>
      <h1 className={styles.fullname}>
        {user?.fullname}
        {isYourself && (
          <Link to="/settings" className={styles.edit}>
            <FaPen size="20" />
          </Link>
        )}
      </h1>
      {/* eslint-disable-next-line react/no-danger */}
      <p className={styles.introduce} dangerouslySetInnerHTML={{ __html: bbcodeToHTML(user?.introduce || '') }} />
      <ListCollection userId={user?.id || 0} />

      {isYourself && (
        <>
          <div className={styles.actions}>
            <Dropdown
              isShow={isActive}
              align="left"
              activator={
                <Button className={styles.btnDropdown} onClick={toggleActive}>
                  <FiPlus size="32" />
                </Button>
              }
              onClose={toggleActive}
            >
              <List>
                <List.Item main> Tạo </List.Item>
                <List.Item
                  onClick={() => {
                    toggleModalShowFormPin();
                    detailPin.setTypeForm('add');
                  }}
                >
                  Ghim
                </List.Item>
                <List.Item
                  onClick={() => {
                    toggleModalShowFormCollection();
                    detailCollection.setTypeForm('add');
                  }}
                >
                  Bộ sưu tập
                </List.Item>
              </List>
            </Dropdown>
          </div>
          <ModalFormCollection />
          <ModalDeleteCollection />
          <ModalFormPin />
        </>
      )}
    </div>
  );
};
export default observer(Profile);
