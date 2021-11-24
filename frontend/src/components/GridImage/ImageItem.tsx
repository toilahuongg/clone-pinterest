import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React from 'react';
import { BsFillBookmarksFill } from 'react-icons/bs';
import { HiOutlineTrash, HiPencil } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Lazyload from 'src/components/Layout/Lazyload';
import useAuth from 'src/hooks/useAuth';
import { TResponseImage } from 'src/hooks/useResponseImage';
import useStore from 'src/stores';
import { usePins } from 'src/stores/pin';

import Button from '../Layout/Button';
import styles from './image.module.scss';

const ImageItem: React.FC<{ item: TResponseImage; isShowAction: boolean }> = ({ item, isShowAction }) => {
  // eslint-disable-next-line object-curly-newline
  const { id, width, height, left, top, featuredImage, user_id: userId } = item;
  const { userModel, collectionModel } = useStore();
  const { isAuth } = useAuth();
  const { detailPin, toggleModalShowFormPin, toggleModalShowDeletePin, toggleModalShowAddPinToCollection } = usePins();
  const isYourself = userModel.detailUser.id === userId;
  const saved = !!collectionModel.listCollection.find(({ listPinIds }) => listPinIds.includes(item.id));
  return (
    <div key={id} className={styles.item} style={{ transform: `translate(${left}px, ${top}px)`, width: `${width}px` }}>
      <div className={styles.featuredImage} style={{ width: `${width}px`, height: `${height}px` }}>
        <Lazyload>
          <img
            src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${featuredImage}`}
            className="img-fluid"
            alt=""
          />
          {isAuth && (
            <>
              {isShowAction && (
                <div className={styles.actions}>
                  {isYourself && isShowAction && (
                    <Button
                      className={styles.btnEdit}
                      onClick={() => {
                        toggleModalShowFormPin();
                        detailPin.setTypeForm('edit');
                        applySnapshot(detailPin, item);
                      }}
                    >
                      <HiPencil size="20" />
                    </Button>
                  )}

                  {saved && (
                    <Button
                      className={styles.btnDelete}
                      onClick={() => {
                        toggleModalShowDeletePin();
                        applySnapshot(detailPin, item);
                      }}
                    >
                      <HiOutlineTrash color="#fff" size="20" />
                    </Button>
                  )}
                </div>
              )}
              {!isYourself && (
                <div className={styles.save}>
                  <Button
                    className={styles.btnSave}
                    onClick={() => {
                      toggleModalShowAddPinToCollection();
                      applySnapshot(detailPin, item);
                    }}
                  >
                    <BsFillBookmarksFill color="rgb(233, 21, 21)" size="20" />
                  </Button>
                </div>
              )}
            </>
          )}
        </Lazyload>
      </div>
      <h3 className={styles.title}>
        <Link to={`/pin/${item.slug}`}>{item.title}</Link>
      </h3>
    </div>
  );
};
export default observer(ImageItem);
