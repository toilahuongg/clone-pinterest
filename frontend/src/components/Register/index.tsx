import axios from 'axios';
import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import React, { FormEvent } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helpers/instance';
import useUsers from 'src/hooks/useUsers';

import Button from '../Layout/Button';
import Form from '../Layout/Form';

type TProps = {
  onClose: () => void;
  openLogin: () => void;
};
const Register: React.FC<TProps> = ({ onClose, openLogin }) => {
  const { detailUser: user, auth } = useUsers();
  const { setToken } = auth;
  const {
    username,
    fullname,
    email,
    gender,
    password,
    confirm,
    loading,
    setUsername,
    setFullname,
    setEmail,
    setGender,
    setPassword,
    setConfirm,
    setLoading,
  } = user;

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await instance.post('/user/register', getSnapshot(user));
      setToken(response.data.token);
      onClose();
      toast.success('Tạo tài khoản thành công!');
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

  const handleOpenLogin = () => {
    applySnapshot(user, {});
    onClose();
    openLogin();
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Form.Input label="Fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
      <Form.Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Form.Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="male"> Nam </option>
        <option value="famale"> Nữ </option>
        <option value="other"> Khác </option>
      </Form.Select>
      <Form.Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="******"
      />
      <Form.Input
        type="password"
        label="Confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="******"
      />
      <Button type="submit" variant="block-primary" loading={loading}>
        Đăng Ký
      </Button>
      <Button type="button" variant="block-outline-second" onClick={() => handleOpenLogin()}>
        Đăng Nhập
      </Button>
    </Form>
  );
};
export default observer(Register);
