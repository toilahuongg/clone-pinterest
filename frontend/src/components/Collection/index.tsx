import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useEffect } from 'react';
import { HiOutlineTrash, HiPencil } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import useStore from 'src/stores';
import { useCollections } from 'src/stores/collection';

import Button from '../Layout/Button';
import styles from './collection.module.scss';

type TProps = {
  userId: number;
};

const ListCollection: React.FC<TProps> = ({ userId }) => {
  const {
    listCollection,
    detailCollection,
    isLoading,
    setLoading,
    getListCollection,
    toggleModalShowFormCollection,
    toggleModalShowDeleteCollection,
  } = useCollections();
  const { userModel } = useStore();
  const { detailUser } = userModel;
  const { isAuth } = useAuth();
  const isYourself = detailUser.id === userId;

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await getListCollection(userId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId > 0) run();
  }, [userId]);

  return isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.listCollection}>
      {listCollection.map((collection) => (
        <div key={collection.id} className={styles.item}>
          <div className={styles.thumbnail}>
            {collection.pins.length > 0 && (
              <img
                src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${collection.pins[0].featuredImage}`}
                alt=""
              />
            )}
            {isAuth && isYourself && (
              <div className={styles.actions}>
                <Button
                  className={styles.btnEdit}
                  onClick={() => {
                    toggleModalShowFormCollection();
                    detailCollection.setTypeForm('edit');
                    applySnapshot(detailCollection, getSnapshot(collection));
                  }}
                >
                  <HiPencil size="20" />
                </Button>
                <Button
                  className={styles.btnDelete}
                  onClick={() => {
                    toggleModalShowDeleteCollection();
                    applySnapshot(detailCollection, getSnapshot(collection));
                  }}
                >
                  <HiOutlineTrash color="#fff" size="20" />
                </Button>
              </div>
            )}
          </div>
          <h3 className={styles.title}>
            <Link to={`/collection/${collection.slug}`}>{collection.title}</Link>
          </h3>
        </div>
      ))}
    </div>
  );
};

export default observer(ListCollection);
