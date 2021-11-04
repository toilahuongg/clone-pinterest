import Button from '../Layout/Button';
import Form from '../Layout/Form';

const Register = () => {
  return (
    <Form>
      <Form.Input label="Username" error="Username không được quá 5 ký tự" />
      <Form.Input label="Fullname" />
      <Form.Input type="email" label="Email" />
      <Form.Select label="Gender">
        <option value="male"> Nam </option>
        <option value="famale"> Nữ </option>
      </Form.Select>
      <Form.Input type="password" label="Password" placeholder="******" />
      <Form.Input type="password" label="Confirm" placeholder="******" />
      <Button variant="block-primary"> Đăng Ký </Button>
      <Button variant="block-outline-second"> Đăng Nhập </Button>
    </Form>
  );
};
export default Register;
