import { useNavigate } from 'react-router-dom';
import type { CreateUserInput } from '@isac-chuab/financial-shared';

import { Form, Modal, Button, Input } from 'antd';

import { trpc } from '../../utils/trpc';
import NewPassword from '../NewPassword';

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
    onSuccess: () => navigate('/financial'),
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const submitForm = (values: CreateUserInput) => {
    createUserMutation.mutate(values);
  };

  return (
    <Modal
      title="New Account"
      onCancel={() => setIsOpen(false)}
      onOk={form.submit}
      open={isOpen}
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>,

        <Button
          key="ok"
          type="primary"
          loading={createUserMutation.isPending}
          disabled={createUserMutation.isPending}
          onClick={form.submit}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="w-full" onFinish={submitForm} disabled={false}>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Required field' },
            { type: 'email', message: 'Please enter a valid email' },
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
