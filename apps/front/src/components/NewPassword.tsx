import { Form } from 'antd';
import Password from 'antd/es/input/Password';

const NewPassword = () => {
  return (
    <>
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
              if (!value || getFieldValue('newPassword') !== value) {
                return Promise.reject(new Error('As senhas não coincidem'));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Password />
      </Form.Item>
    </>
  );
};

export default NewPassword;
