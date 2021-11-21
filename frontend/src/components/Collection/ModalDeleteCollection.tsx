import axios from 'axios';
import { observer } from 'mobx-react';
import React from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import { useCollections } from 'src/stores/collection';

import Button from '../Layout/Button';
import Modal from '../Layout/Modal';

const ModalDeleteCollection = () => {
  const { detailCollection, isModalShowDeleteCollection, toggleModalShowDeleteCollection, deleteCollection } =
    useCollections();
  // eslint-disable-next-line object-curly-newline
  const { id, title, isLoading, setLoading } = detailCollection;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await instance.delete(`/collection/${id}`);
      deleteCollection(id);
      toast.success('Đã xóa');
      toggleModalShowDeleteCollection();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isShow={isModalShowDeleteCollection} onClose={toggleModalShowDeleteCollection} size="md">
      <Modal.Header> Xóa {title} </Modal.Header>
      <Modal.Body>
        Bạn có muốn xóa <b>{title}</b> không?
      </Modal.Body>
      <Modal.Footer align="right">
        <Button
          type="button"
          style={{ padding: '8px', borderRadius: '20px' }}
          variant="second"
          onClick={handleDelete}
          loading={isLoading}
        >
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(ModalDeleteCollection);
