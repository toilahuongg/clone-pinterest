import axios from 'axios';
import { observer } from 'mobx-react';
import React from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';
import { useCollection, useCollections } from 'src/stores/collection';
import { usePins } from 'src/stores/pin';

import Button from '../Layout/Button';
import Modal from '../Layout/Modal';

const ModalDeletePin = () => {
  const { collectionModel } = useStore();
  const collections = useCollections();
  const { detailPin, isModalShowDeletePin, toggleModalShowDeletePin, deletePin } = usePins();
  const collection = useCollection();
  // eslint-disable-next-line object-curly-newline
  const { id, title, isLoading, setLoading } = detailPin;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await instance.delete(`/pin/${id}/${collection.id}`);
      collection.deletePin(id);
      deletePin(id);
      collections.deletePin(collection.id, id);
      collectionModel.deletePin(collection.id, id);
      toast.success('Đã xóa');
      toggleModalShowDeletePin();
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
    <Modal isShow={isModalShowDeletePin} onClose={toggleModalShowDeletePin} size="md">
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
ModalDeletePin.defaultProps = { cId: undefined };
export default observer(ModalDeletePin);
