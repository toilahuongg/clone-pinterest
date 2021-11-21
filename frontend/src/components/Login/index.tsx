import axios from 'axios';
import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React, { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useAuth from 'src/hooks/useAuth';
import { useUsers } from 'src/stores/user';

import Button from '../Layout/Button';
import Form from '../Layout/Form';

type TProps = {
  onClose: () => void;
  openRegister: () => void;
};
const Login: React.FC<TProps> = ({ onClose, openRegister }) => {
  const { setToken } = useAuth();
  const { detailUser: user } = useUsers();
  const [password, setPassword] = useState<string>('');
  // eslint-disable-next-line object-curly-newline
  const { isLoading, username, setLoading, setUsername } = user;

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await instance.post('/user/login', {
        username,
        password,
      });
      onClose();
      applySnapshot(user, response.data);
      setToken(response.data.token);
      window.location.href = '/profile';
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

  const handleOpenRegister = () => {
    onClose();
    openRegister();
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Form.Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="******"
      />
      <Button type="submit" variant="block-primary" loading={isLoading}>
        Đăng Nhập
      </Button>
      <Button type="button" variant="block-outline-second" onClick={() => handleOpenRegister()}>
        Đăng Ký
      </Button>
    </Form>
  );
};

export default observer(Login);
