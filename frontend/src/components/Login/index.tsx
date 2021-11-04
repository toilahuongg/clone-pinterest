import Button from '../Layout/Button';
import Form from '../Layout/Form';

const Login = () => {
  return (
    <Form>
      <Form.Input label="Username" error="Username không được quá 5 ký tự" />
      <Form.Input type="password" label="Password" placeholder="******" />
      <Button variant="block-primary"> Đăng Nhập </Button>
      <Button variant="block-outline-second"> Đăng Ký </Button>
    </Form>
  );
};

export default Login;
