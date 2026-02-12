import type { ChangePasswordInput } from '@isac-chuab/financial-shared';

import { Form, Modal, Button } from 'antd';
import Password from 'antd/es/input/Password';

import { trpc } from '../../utils/trpc';
import NewPassword from '../NewPassword';

const ChangePassowrd = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [form] = Form.useForm<ChangePasswordInput>();
  const changePassMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      form.resetFields();
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error changing password:', error);
    },
  });

  const submitForm = (values: ChangePasswordInput) => {
    changePassMutation.mutate(values);
  };

  return (
    <Modal
      title="Trocar Senha"
      onCancel={() => setIsOpen(false)}
      onOk={form.submit}
      open={isOpen}
      footer={null}
    >
      <Form form={form} layout="vertical" className="w-full" onFinish={submitForm} disabled={false}>
        <Form.Item
          label="Senha atual"
          name="currentPassword"
          rules={[{ required: true, message: 'Por favor, insira uma senha atual' }]}
        >
          <Password />
        </Form.Item>

        <NewPassword />
        
        <div className="flex justify-end gap-2 mt-6">
          <Button key="cancel" onClick={() => setIsOpen(false)} disabled={changePassMutation.isPending}>
            Cancelar
          </Button>

          <Button
            key="ok"
            type="primary"
            htmlType='submit'
            loading={changePassMutation.isPending}
            disabled={changePassMutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePassowrd;
