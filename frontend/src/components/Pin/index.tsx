import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React, { useEffect } from 'react';
import { BsFillBookmarksFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { Redirect, useParams } from 'react-router-dom';
import instance from 'src/helpers/instance';
import useComments from 'src/stores/comment';
import { usePins } from 'src/stores/pin';
import { useUsers } from 'src/stores/user';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import ModalAddPinToCollection from './ModalAddPinToCollection';
import styles from './pin.module.scss';

const Pin = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Redirect to="/" />;
  const { detailPin, toggleModalShowAddPinToCollection } = usePins();
  const { getUser, detailUser: user } = useUsers();
  const { detailComment, listComment, isLoading, addComment, setLoading } = useComments();
  useEffect(() => {
    getUser(detailPin.user_id, false);
  }, [detailPin.user_id]);

  useEffect(() => {
    document.title = detailPin.isLoading ? 'Loading...' : detailPin.title;
  }, [detailPin.title, detailPin.isLoading]);

  useEffect(() => {
    const run = async () => {
      try {
        detailPin.setLoading(true);
        const response = await instance.get(`/pin/${slug}`);
        applySnapshot(detailPin, response.data);
      } finally {
        detailPin.setLoading(false);
      }
    };
    run();
  }, [slug]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/comment/${detailPin.id}`);
        applySnapshot(listComment, response.data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [detailPin.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      detailComment.setLoading(true);
      const response = await instance.post('/comment', {
        content: detailComment.content,
        user_id: user.id,
        pin_id: detailPin.id,
      });
      addComment(response.data);
      detailComment.setContent('');
    } catch (error) {
      console.log(error);
    } finally {
      detailComment.setLoading(false);
    }
  };
  return detailPin.isLoading || user.isLoading || isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.featuredImage}>
        <img
          src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${detailPin.featuredImage}`}
          alt=""
        />
      </div>
      <div className={styles.pin}>
        <h1 className={styles.title}>{detailPin.title}</h1>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img
                src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user.avatar}`}
                alt={`avatar of ${user.fullname}`}
              />
            ) : (
              <FaUser size="48" color="rgb(108 108 108)" />
            )}
          </div>
          <h3 className={styles.fullname}>{user.fullname}</h3>
        </div>
        <div className={styles.content}>{detailPin.content}</div>
        <div className={styles.formContent}>
          <Form onSubmit={handleSubmitComment}>
            <input
              type="text"
              value={detailComment.content}
              onChange={(e) => detailComment.setContent(e.target.value)}
              placeholder="Enter..."
            />
            <button type="submit"> {detailComment.isLoading ? 'Loading...' : 'Gửi'} </button>
          </Form>
        </div>

        <ul className={styles.listComment}>
          {listComment.map((comment) => (
            <li key={comment.id}>
              <div className={styles.avatar}>
                {comment.user.avatar ? (
                  <img
                    src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${comment.user.avatar}`}
                    alt={`avatar of ${comment.user.fullname}`}
                  />
                ) : (
                  <FaUser size="32" color="rgb(108 108 108)" />
                )}
              </div>
              <div className={styles.body}>
                <h4 className={styles.fullname}> {comment.user.fullname} </h4>
                <div className={styles.cmtContent}> {comment.content} </div>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.save}>
          <Button
            className={styles.btnSave}
            onClick={() => {
              toggleModalShowAddPinToCollection();
            }}
          >
            <BsFillBookmarksFill color="rgb(233, 21, 21)" size="20" />
          </Button>
        </div>
      </div>
      <ModalAddPinToCollection />
    </div>
  );
};

export default observer(Pin);
