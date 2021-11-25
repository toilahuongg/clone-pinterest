import axios from 'axios';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getImage } from 'src/helpers/common';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';
import { useCollection, useCollections } from 'src/stores/collection';
import { usePins } from 'src/stores/pin';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import Modal from '../Layout/Modal';
import styles from './pin.module.scss';

const ModalFormPin: React.FC<{ cId?: number }> = ({ cId }) => {
  const [fileFeaturedImage, setFileFeaturedImage] = useState<File | null>();
  const [collection, setCollection] = useState<string>(`${cId}`);
  const bst = useCollection();
  const [cImage, setCImage] = useState<string | null>(null);
  const { detailPin, isModalShowFormPin, toggleModalShowFormPin, addPin: addPinToList } = usePins();
  const { collectionModel } = useStore();
  const { listCollection, isLoading, addPin, editPin } = useCollections();
  // eslint-disable-next-line object-curly-newline
  const { title, content, featuredImage, typeForm, link, setLink, setTitle, setContent } = detailPin;
  useEffect(() => {
    setCImage(featuredImage);
    return () => {
      URL.revokeObjectURL(cImage || '');
    };
  }, [featuredImage]);

  const options = [
    { label: 'Chọn bộ sưu tập', value: '' },
    ...listCollection.map(({ id, title: t }) => ({ label: t, value: `${id}` })),
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      detailPin.setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content || '');
      formData.append('collection', collection);
      formData.append('link', link || '');
      if (fileFeaturedImage) {
        formData.append('featuredImage', fileFeaturedImage);
        const infoImage = await getImage(fileFeaturedImage);
        formData.append('width', infoImage.width);
        formData.append('height', infoImage.height);
      }
      let response;
      if (typeForm === 'add') {
        response = await instance.post('/pin', formData);
        addPin(parseInt(collection, 10), response.data);
        addPinToList(response.data);
        collectionModel.addPin(parseInt(collection, 10), response.data);
        bst.addPin(response.data);
        toast.success('Tạo ghim thành công');
      } else {
        response = await instance.put(`/pin/${detailPin.id}`, formData);
        editPin(parseInt(collection, 10), detailPin.id, response.data);
        collectionModel.editPin(parseInt(collection, 10), detailPin.id, response.data);
        bst.editPin(detailPin.id, response.data);
        toast.success('Sửa ghim thành công');
      }
      URL.revokeObjectURL(cImage || '');
      setCImage('');
      toggleModalShowFormPin();
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
    <Modal isShow={isModalShowFormPin} onClose={toggleModalShowFormPin} size="lg">
      <Modal.Header>{typeForm === 'add' ? 'Tạo ghim mới' : 'Chỉnh sửa ghim'} </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={styles.grid}>
            <div className={styles.uploadFile}>
              {cImage && (
                <img
                  src={
                    cImage.includes('blob')
                      ? cImage
                      : `${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${cImage}`
                  }
                  className={styles.showImage}
                  alt=""
                />
              )}
              <h3> Choose Image </h3>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setCImage(objectUrl);
                    setFileFeaturedImage(file);
                  }
                }}
              />
            </div>
            <div>
              <Form.Input
                type="text"
                label="Tiêu đề"
                placeholder="Nhập tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {!cId &&
                (isLoading ? (
                  <div className="loader size-sm" />
                ) : (
                  <Form.Select
                    label="Chọn bộ sưu tập"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                  >
                    {options.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                ))}
              <Form.Textarea
                label="Nội dung"
                rows={5}
                placeholder="Nhập nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Form.Input
                type="text"
                label="Link"
                placeholder="URL..."
                value={link || ''}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer align="right">
          <Button
            type="submit"
            style={{ padding: '8px', borderRadius: '20px' }}
            variant={title ? 'second' : 'disable'}
            disabled={!!title}
            loading={detailPin.isLoading}
          >
            {typeForm === 'add' ? 'Tạo' : 'Chỉnh sửa'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
ModalFormPin.defaultProps = { cId: undefined };
export default observer(ModalFormPin);
