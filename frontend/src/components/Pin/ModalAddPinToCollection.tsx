import axios from 'axios';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import { useState } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';
import { usePins } from 'src/stores/pin';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import Modal from '../Layout/Modal';

const ModalAddToCollection = () => {
  const [collection, setCollection] = useState<string>();
  const { detailPin, isModalShowAddPinToCollection, toggleModalShowAddPinToCollection } = usePins();
  const { collectionModel } = useStore();
  const { listCollection, isLoading, addPin } = collectionModel;
  const options = [
    { label: 'Chọn bộ sưu tập', value: '' },
    ...listCollection
      .filter(({ listPinIds }) => !listPinIds.includes(detailPin.id))
      .map(({ id, title: t }) => ({ label: t, value: `${id}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      detailPin.setLoading(true);
      await instance.post('/pin/add-to-collection', {
        pId: detailPin.id,
        cId: parseInt(collection || '0', 10),
      });
      addPin(parseInt(collection || '0', 10), getSnapshot(detailPin));
      toggleModalShowAddPinToCollection();
      toast.success('Đã thêm vào bộ sưu tập');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại');
      }
    } finally {
      detailPin.setLoading(false);
    }
  };

  return (
    <Modal isShow={isModalShowAddPinToCollection} onClose={toggleModalShowAddPinToCollection} size="sm">
      <Modal.Header>Thêm ghim vào bộ sưu tập </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          Thêm <b> {detailPin.title} </b> vào
          {isLoading ? (
            <div className="loader size-sm" />
          ) : (
            <Form.Select label="Bộ sưu tập" value={collection} onChange={(e) => setCollection(e.target.value)}>
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Form.Select>
          )}
        </Modal.Body>
        <Modal.Footer align="right">
          <Button
            type="submit"
            style={{ padding: '8px', borderRadius: '20px' }}
            variant="second"
            loading={detailPin.isLoading}
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default observer(ModalAddToCollection);
