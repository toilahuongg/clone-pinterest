import axios from 'axios';
import { observer } from 'mobx-react';
import React from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';
import { useCollections } from 'src/stores/collection';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import Modal from '../Layout/Modal';
import styles from './collection.module.scss';

const ModalFormCollection = () => {
  const { collectionModel } = useStore();
  const { detailCollection, isModalShowFormCollection, toggleModalShowFormCollection, addCollection, editCollection } =
    useCollections();
  // eslint-disable-next-line object-curly-newline
  const { id, title, isPublic, isLoading, typeForm, setPublic, setTitle, setLoading } = detailCollection;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (typeForm === 'add') {
        const response = await instance.post('/collection', { title, isPublic });
        addCollection(response.data);
        collectionModel.addCollection(response.data);
        toast.success('Tạo bộ sưu tập thành công');
      } else {
        const response = await instance.put(`/collection/${id}`, { title, isPublic });
        editCollection(response.data);
        collectionModel.editCollection(response.data);
        toast.success('Chỉnh sửa bộ sưu tập thành công');
      }
      toggleModalShowFormCollection();
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
    <Modal isShow={isModalShowFormCollection} onClose={toggleModalShowFormCollection} size="md">
      <Modal.Header> {typeForm === 'add' ? 'Tạo' : 'Chỉnh sửa'} bộ sưu tập </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Input
            type="text"
            label="Tên"
            placeholder='Như "Nơi nên đi" hoặc "Món ăn nên làm."'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Input
            type="checkbox"
            label="Công khai"
            className={styles.formCheckbox}
            text={{ type: 'normal', content: 'Hãy cho cả thế giới biết bộ sưu tập này.' }}
            checked={isPublic}
            onChange={() => setPublic(!isPublic)}
          />
        </Modal.Body>
        <Modal.Footer align="right">
          <Button
            type="submit"
            style={{ padding: '8px', borderRadius: '20px' }}
            variant={title ? 'second' : 'disable'}
            disabled={!!title}
            loading={isLoading}
          >
            {typeForm === 'add' ? 'Tạo' : 'Chỉnh sửa'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default observer(ModalFormCollection);
