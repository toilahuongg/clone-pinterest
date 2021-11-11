import axios from 'axios';
import { observer } from 'mobx-react';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';

import Button from '../Layout/Button';
import Form from '../Layout/Form';
import styles from './settings.module.scss';

const SettingChangePassword = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await instance.put('/user/change-password', { oldPassword, newPassword, confirmPassword });
      console.log(response.data);
      toast.success('Cập nhật thành công');
    } catch (error) {
      console.log('error');
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
      <h1 className={styles.title}> Chỉnh sửa mật khẩu</h1>
      <Form.Input
        label="Mật khẩu cũ"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <Form.Input
        label="Mật khẩu mới"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Form.Input
        label="Nhập lại mật khẩu"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button variant="second" type="submit" loading={isLoading}>
        Change
      </Button>
    </Form>
  );
};

export default observer(SettingChangePassword);
