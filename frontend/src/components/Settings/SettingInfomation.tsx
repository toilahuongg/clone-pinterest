import axios from 'axios';
import { observer } from 'mobx-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useStore from 'src/stores';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import styles from './settings.module.scss';

const SettingInfomation = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [fileAvatar, setFileAvatar] = useState<File | null>();
  const [fileCover, setFileCover] = useState<File | null>();
  const { userModel } = useStore();
  const { detailUser } = userModel;
  // eslint-disable-next-line object-curly-newline
  const { fullname, introduce, gender, avatar, cover, setFullname, setIntroduce, setGender, setAvatar, setCover } =
    detailUser;
  const [cAvatar, setCAvatar] = useState<string | null>(null);
  const [cCover, setCCover] = useState<string | null>(null);

  useEffect(() => {
    setCAvatar(avatar);
    return () => {
      URL.revokeObjectURL(cAvatar || '');
    };
  }, [avatar]);

  useEffect(() => {
    setCCover(cover);
    return () => {
      URL.revokeObjectURL(cCover || '');
    };
  }, [cover]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('introduce', introduce || '');
      formData.append('gender', gender);
      if (fileAvatar) formData.append('avatar', fileAvatar);
      if (fileCover) formData.append('cover', fileCover);
      const response = await instance.put('/user/update-infomation', formData);
      if (response.data?.avatar) {
        setAvatar(response.data.avatar);
        URL.revokeObjectURL(cAvatar || '');
      }
      if (response.data?.cover) {
        setCover(response.data.cover);
        URL.revokeObjectURL(cCover || '');
      }
      toast.success('Cập nhật thành công');
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
    <Form onSubmit={handleSubmit}>
      <h1 className={styles.title}> Hồ sơ cá nhân</h1>
      <Form.Input label="Họ và tên" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      <Form.Textarea
        label="Tiểu sử ngắn"
        rows={5}
        value={introduce || ''}
        onChange={(e) => setIntroduce(e.target.value)}
      />
      <Form.Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="male"> Nam </option>
        <option value="famale"> Nữ </option>
        <option value="other"> Khác </option>
      </Form.Select>
      <Form.Input
        type="file"
        label="Avatar"
        accept=".png,.jpg,.jpeg,.gif"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            const objectUrl = URL.createObjectURL(file);
            setCAvatar(objectUrl);
            setFileAvatar(file);
          }
        }}
      />
      {cAvatar && (
        <img
          src={
            cAvatar.includes('blob')
              ? cAvatar
              : `${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${cAvatar}`
          }
          className={styles.showImage}
          alt=""
        />
      )}
      <Form.Input
        type="file"
        label="Avatar"
        accept=".png,.jpg,.jpeg,.gif"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            const objectUrl = URL.createObjectURL(file);
            setCCover(objectUrl);
            setFileCover(file);
          }
        }}
      />
      {cCover && (
        <img
          src={
            cCover.includes('blob')
              ? cCover
              : `${process.env.REACT_APP_SERVER}/${process.env.REACT_APP_FOLDER_IMAGE}/${cCover}`
          }
          className={styles.showImage}
          alt=""
        />
      )}
      <Button variant="second" type="submit" loading={isLoading}>
        Save
      </Button>
    </Form>
  );
};

export default observer(SettingInfomation);
