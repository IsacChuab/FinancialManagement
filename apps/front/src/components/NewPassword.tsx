import { Form } from 'antd';
import Password from 'antd/es/input/Password';

const NewPassword = () => {
  return (
    <>
      <Form.Item
        label="New password"
        name="newPassword"
        rules={[
          { required: true, message: 'Please enter a new password' },
          { min: 3, max: 10, message: 'Password must be between 3 and 10 characters' },
        ]}
      >
        <Password />
      </Form.Item>

      <Form.Item
        label="Confirm new password"
        name="confirmNewPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Please confirm the new password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') !== value) {
                return Promise.reject(new Error('Passwords do not match'));
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
