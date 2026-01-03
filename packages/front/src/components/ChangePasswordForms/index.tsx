import { Form, Modal, Button } from 'antd';
import Password from 'antd/es/input/Password';

import type { ChangePasswordInput } from '../../../../api/src/user/userValidators';
import { trpc } from '../../utils/trpc';

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
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>,

        <Button
          key="ok"
          type="primary"
          loading={changePassMutation.isPending}
          disabled={changePassMutation.isPending}
          onClick={() => form.submit()}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={submitForm}
        initialValues={{ type: 'debit' }}
        disabled={false}
      >
        <Form.Item
          label="Senha atual"
          name="currentPassword"
          rules={[{ required: true, message: 'Por favor, insira uma senha atual' }]}
        >
          <Password />
        </Form.Item>

        <Form.Item
          label="Nova senha"
          name="newPassword"
          rules={[
            { required: true, message: 'Por favor, insira uma nova senha' },
            { min: 3, max: 10, message: 'A senha deve ter entre 3 e 10 caracteres' },
          ]}
        >
          <Password />
        </Form.Item>

        <Form.Item
          label="Confirmar nova senha"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Por favor, confirme a nova senha' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('As senhas não coincidem'));
              },
            }),
          ]}
        >
          <Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassowrd;
