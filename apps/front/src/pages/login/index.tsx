import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Form, Input } from 'antd';
import { trpc } from '../../utils/trpc';

import CreateAccount from '../../components/CreateAccount';
import ForgotPassword from '../../components/ForgotPassword';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);
  const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);

  const submit = trpc.auth.login.useMutation({
    onSuccess: () => navigate('/financial'),
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const handleSubmit = (values: { email: string; password: string }) => {
    submit.mutate(values);
  };

  return (
    <div className="w-full h-220 flex justify-center items-center">
      <div className="w-100 h-110 flex flex-col justify-around rounded-2xl border border-gray-300 p-8 shadow-md">
        <h1 className="text-4xl mb-6 text-center">Isto é um teste</h1>

        <Form
          form={form}
          onFinish={handleSubmit}
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
            <a onClick={() => setIsOpenForgotPassword(true)}>Forgot Password</a>

            <Form.Item className="text-center">
              <Button htmlType="submit" type="primary">
                Login
              </Button>
            </Form.Item>
          </div>
        </Form>

        <div className="w-full">
          <Divider />
          <Button
            onClick={() => setIsOpenCreateAccount(true)}
            type="primary"
            className="w-full py-2!"
          >
            Criar uma conta
          </Button>
        </div>

        <CreateAccount isOpen={isOpenCreateAccount} setIsOpen={setIsOpenCreateAccount} />
        <ForgotPassword isOpen={isOpenForgotPassword} setIsOpen={setIsOpenForgotPassword} />
      </div>
    </div>
  );
};

export default Login;
