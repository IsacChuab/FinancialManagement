import { Button, Divider, Form, Input } from 'antd';
import { trpc } from '../../utils/trpc';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const submit = trpc.auth.login.useMutation({
    onSuccess: () => {
      navigate('/financial');
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const createUser = trpc.auth.createUser.useMutation({
    onSuccess: () => {
      navigate('/financial');
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const handleCreateUser = async () => {
    const values = form.getFieldsValue();
    if (!values?.user && !values?.password) {
      form.submit();
      return;
    }

    await createUser.mutateAsync(values);
  };

  return (
    <div className="w-full h-220 flex justify-center items-center">
      <div className="w-100 h-110 flex flex-col justify-around rounded-2xl border border-gray-300 p-8 shadow-md bg-white">
        <h1 className="text-4xl mb-6 text-center">Login</h1>

        <Form
          form={form}
          onFinish={(values) => submit.mutateAsync(values)}
          layout="vertical"
          className="w-full h-full flex flex-col justify-around"
        >
          <Form.Item
            name="email"
            label="User Email"
            rules={[
              { required: true, message: 'Digite seu usuário' },
              { type: 'email', message: 'Digite um email válido' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Digite sua senha' }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-between">
            <a href="/">Forgot Password</a>

            <Form.Item className="text-center">
              <Button htmlType="submit" type="primary">
                Login
              </Button>
            </Form.Item>
          </div>
        </Form>

        <div className="w-full">
          <Divider />
          <Button onClick={handleCreateUser} type="primary" className="w-full py-2!">
            Criar uma conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
