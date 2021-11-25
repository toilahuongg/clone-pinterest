import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import moment from 'moment';
import React, { useEffect } from 'react';
import { BsFillBookmarksFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { Link, Redirect, useParams } from 'react-router-dom';
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
  const { detailComment, listComment, addComment } = useComments();

  useEffect(() => {
    document.title = detailPin.isLoading ? 'Loading...' : detailPin.title;
  }, [detailPin.title, detailPin.isLoading]);

  useEffect(() => {
    const run = async () => {
      try {
        detailPin.setLoading(true);
        const response = await instance.get(`/pin/${slug}`);
        applySnapshot(detailPin, response.data);
        await getUser(response.data.user_id, false);
        const response2 = await instance.get(`/comment/${detailPin.id}`);
        applySnapshot(listComment, response2.data);
      } catch {
        window.location.href = '/';
      } finally {
        detailPin.setLoading(false);
      }
    };
    run();
  }, [slug]);

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
  return detailPin.isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <div className={styles.featuredImage}>
          <img
            src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${detailPin.featuredImage}`}
            alt=""
          />
          <div className={styles.link}>
            {detailPin.link ? (
              <a href={detailPin.link} target="_blank" rel="noreferrer">
                Chuyển sang liên kết
              </a>
            ) : (
              <a
                href={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${detailPin.featuredImage}`}
                target="_blank"
                rel="noreferrer"
              >
                Xem hình ảnh
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={styles.pin}>
        <h1 className={styles.title}>{detailPin.title}</h1>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <Link to={`/profile/${user.username}`}>
              {user.avatar ? (
                <img
                  src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user.avatar}`}
                  alt={`avatar of ${user.fullname}`}
                />
              ) : (
                <FaUser size="48" color="rgb(108 108 108)" />
              )}
            </Link>
          </div>
          <div>
            <h3 className={styles.fullname}>
              <Link to={`/profile/${user.username}`}> {user.fullname} </Link>
            </h3>
            <p className={styles.time}>{moment(detailPin.createdAt).fromNow()}</p>
          </div>
        </div>
        <div className={styles.content}>{detailPin.content}</div>
        <ul className={styles.listComment}>
          {listComment.map((comment) => (
            <li key={comment.id}>
              <div className={styles.avatar}>
                <Link to={`/profile/${comment.user.fullname}`}>
                  {comment.user.avatar ? (
                    <img
                      src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${comment.user.avatar}`}
                      alt={`avatar of ${comment.user.fullname}`}
                    />
                  ) : (
                    <FaUser size="32" color="rgb(108 108 108)" />
                  )}
                </Link>
              </div>
              <div className={styles.body}>
                <h4 className={styles.fullname}>
                  <Link to={`/profile/${comment.user.fullname}`}> {comment.user.fullname} </Link>{' '}
                  <span className={styles.time}> {moment(comment.createdAt).fromNow()}</span>
                </h4>
                <div className={styles.cmtContent}> {comment.content} </div>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.formContent}>
          <Form onSubmit={handleSubmitComment}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img
                  src={`${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${user.avatar}`}
                  alt={`avatar of ${user.fullname}`}
                />
              ) : (
                <FaUser size="32" color="rgb(108 108 108)" />
              )}
            </div>
            <input
              type="text"
              value={detailComment.content}
              onChange={(e) => detailComment.setContent(e.target.value)}
              placeholder="Thêm nhận xét"
            />
          </Form>
        </div>
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
