import axios from 'axios';
import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import React, { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useUsers from 'src/hooks/useUsers';

import Button from '../Layout/Button';
import Form from '../Layout/Form';

type TProps = {
  onClose: () => void;
  openRegister: () => void;
};
const Login: React.FC<TProps> = ({ onClose, openRegister }) => {
  const history = useHistory();
  const { detailUser: user, auth } = useUsers();
  const { setToken } = auth;
  // eslint-disable-next-line object-curly-newline
  const { loading, username, password, setLoading, setUsername, setPassword } = user;

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await instance.post('/user/login', getSnapshot(user));
      onClose();
      applySnapshot(user, response.data);
      console.log(response.data);
      setToken(response.data.token);
      history.push('/profile');
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
      <Button type="submit" variant="block-primary" loading={loading}>
        Đăng Nhập
      </Button>
      <Button type="button" variant="block-outline-second" onClick={() => handleOpenRegister()}>
        Đăng Ký
      </Button>
    </Form>
  );
};

export default observer(Login);
