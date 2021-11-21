import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { Redirect, useParams } from 'react-router-dom';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';
import { useCollection } from 'src/stores/collection';
import { usePins } from 'src/stores/pin';
import { useUsers } from 'src/stores/user';

import GridImage from '../GridImage';
import Button from '../Layout/Button';
import Dropdown from '../Layout/Dropdown';
import List from '../Layout/List';
import ModalDeletePin from '../Pin/ModalDeletePin';
import ModalFormPin from '../Pin/ModalFormPin';
import styles from './collection.module.scss';

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Redirect to="/" />;
  const { detailPin, toggleModalShowFormPin } = usePins();
  const collection = useCollection();
  const { title, isPublic, user_id: userId, fetched, setFetched } = collection;
  const { getUser, detailUser: user } = useUsers();
  useEffect(() => {
    getUser(userId, false);
  }, []);
  const { userModel } = useStore();
  const { detailUser } = userModel;
  const isYourself = detailUser.id === userId;

  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);
  useEffect(() => {
    document.title = collection.isLoading ? 'Loading...' : collection.title;
  }, [collection.title, collection.isLoading]);
  useEffect(() => {
    const run = async () => {
      try {
        collection.setLoading(true);
        const response = await instance.get(`/collection/${slug}`);
        applySnapshot(collection, response.data);
        setFetched(true);
      } finally {
        collection.setLoading(false);
      }
    };
    if (slug) run();
  }, [slug]);
  if (fetched && detailUser.fetched && detailUser.id !== userId && !isPublic) return <Redirect to="/" />;
  return user.isLoading || collection.isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.collection}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.avatar}>
          {user?.avatar ? (
            <img
              src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user?.avatar}`}
              alt="avatar"
            />
          ) : (
            <FaUser size="24" color="rgb(108 108 108)" />
          )}
        </div>
        <h4 className={styles.fullname}>{user?.fullname}</h4>
      </div>
      <GridImage items={getSnapshot(collection.pins)} isShowAction={isYourself} />
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
              </List>
            </Dropdown>
          </div>
          <ModalDeletePin />
          <ModalFormPin cId={collection.id} />
        </>
      )}
    </div>
  );
};
export default observer(Collection);
