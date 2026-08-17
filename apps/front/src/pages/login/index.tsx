import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Form, Input } from 'antd';
import { FaCalculator, FaChartLine, FaCoins, FaPen } from 'react-icons/fa6';

import { trpc } from '../../utils/trpc';

import Logo from '../../assets/zc_logo.png';
import GridPattern from '../../assets/svgs/GridPattern';
import ChartIllustration from '../../assets/svgs/ChartIllustration';
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
    <div className="min-h-screen w-full flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-blue-950">
        <GridPattern />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-16 w-16 rounded-full bg-blue-50 object-cover" />
            <span className="text-slate-100 text-xl font-semibold tracking-wide">
              Financial Management
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-semibold text-white leading-snug mb-4">
              Organize suas finanças com clareza e simplicidade
            </h2>
            <p className="text-slate-300 text-base">
              Acompanhe contas, receitas e despesas em um só lugar, com uma visão clara do seu
              dinheiro.
            </p>

            <div className="flex gap-6 mt-8 text-slate-400">
              <FaChartLine className="h-6 w-6" />
              <FaCalculator className="h-6 w-6" />
              <FaCoins className="h-6 w-6" />
              <FaPen className="h-6 w-6" />
            </div>
          </div>

          <ChartIllustration />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center lg:items-start mb-8">
            <img src={Logo} alt="Logo" className="h-16 w-16 rounded-full bg-blue-50 lg:hidden mb-4" />
            <h1 className="text-3xl font-semibold text-slate-800">Bem-vindo de volta</h1>
            <p className="text-slate-500 mt-1">Entre com sua conta para continuar</p>
          </div>

          <Form form={form} onFinish={handleSubmit} layout="vertical" className="w-full">
            <Form.Item
              name="email"
              label="User Email"
              rules={[
                { required: true, message: 'Digite seu usuário' },
                { type: 'email', message: 'Digite um email válido' },
              ]}
            >
              <Input autoFocus size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Digite sua senha' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <div className="flex justify-between items-center mb-2">
              <a onClick={() => setIsOpenForgotPassword(true)}>Forgot Password</a>
            </div>

            <Form.Item className="mt-4">
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                block
                disabled={submit.isPending}
                loading={submit.isPending}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Divider>ou</Divider>

          <Button size="large" block onClick={() => setIsOpenCreateAccount(true)}>
            Criar uma conta
          </Button>

          <CreateAccount isOpen={isOpenCreateAccount} setIsOpen={setIsOpenCreateAccount} />
          <ForgotPassword isOpen={isOpenForgotPassword} setIsOpen={setIsOpenForgotPassword} />
        </div>
      </div>
    </div>
  );
};

export default Login;
