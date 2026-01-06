import { Form, Modal, Button, Input } from 'antd';

import type { CreateUserInput } from '../../../../api/src/user/userValidators';
import { trpc } from '../../utils/trpc';
import NewPassword from '../NewPassword';
import { useNavigate } from 'react-router-dom';

const CreateAccount = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [form] = Form.useForm<CreateUserInput>();
  const navigate = useNavigate();

  const createUserMutation = trpc.auth.createUser.useMutation({
    onSuccess: () => {
      navigate('/financial');
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const submitForm = async (values: CreateUserInput) => {
    await createUserMutation.mutateAsync(values);
  };

  return (
    <Modal
      title="Nova Conta"
      onCancel={() => setIsOpen(false)}
      onOk={form.submit}
      open={isOpen}
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>,

        <Button
          key="ok"
          type="primary"
          loading={createUserMutation.isPending}
          disabled={createUserMutation.isPending}
          onClick={form.submit}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="w-full" onFinish={submitForm} disabled={false}>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Campo obrigatório' },
            { type: 'email', message: 'Por favor, insira um e-mail válido' },
          ]}
        >
          <Input />
        </Form.Item>

        <NewPassword />
      </Form>
    </Modal>
  );
};

export default CreateAccount;
