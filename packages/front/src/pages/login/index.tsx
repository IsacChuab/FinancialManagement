import { Button, Divider, Form, Input } from 'antd';
import trpc from '../../utils/trpc';
import type { UserInput } from '../../../../api/src/user/userValidators';

const Login = () => {
  const [form] = Form.useForm();

  const submit = async (values: UserInput) => {
    console.log('submit', values);
  };

  const createUser = async () => {
    const values = form.getFieldsValue();

    if (!values?.user && !values?.password) {
      alert('Please enter your username and password');
      return;
    }
    console.log(values);

    await trpc.user.newUser.mutate(values);
    console.log('createUser', values);
  };

  return (
    <div className="w-full h-220 flex justify-center items-center">
      <div className="w-100 h-110 flex flex-col justify-around rounded-2xl border border-gray-300 p-8 shadow-md bg-white">
        <h1 className="text-4xl mb-6 text-center">Login</h1>

        <Form
          form={form}
          onFinish={submit}
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
          <Button onClick={createUser} type="primary" className="w-full py-2!">
            Criar uma conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
