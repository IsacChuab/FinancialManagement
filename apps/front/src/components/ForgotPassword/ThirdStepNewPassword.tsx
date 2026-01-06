import { Form } from 'antd';
import { Button } from 'antd';

import NewPassword from '../NewPassword';
import { trpc } from '../../utils/trpc';
import type { StepStatus } from '.';

const ThirdStepNewPassword = ({
  emailToRecovery,
  code,
  setIsOpen,
  setStepStatus,
}: {
  emailToRecovery: string;
  code: string;
  setIsOpen: (isOpen: boolean) => void;
  setStepStatus: (stepStatus: Record<number, StepStatus>) => void;
}) => {
  const [form] = Form.useForm<{ newPassword: string; confirmNewPassword: string }>();

  const thirdStepMutation = trpc.auth.thirdStepForgotPassword.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      setStepStatus({ 0: 'process', 1: 'wait', 2: 'wait' });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  const submitNewPass = (values: { newPassword: string; confirmNewPassword: string }) => {
    thirdStepMutation.mutate({ email: emailToRecovery, code, ...values });
  };

  const handleBackStep = () => {
    form.resetFields();
    setStepStatus({ 1: 'process', 2: 'wait' });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full"
      onFinish={submitNewPass}
      disabled={false}
    >
      <NewPassword />

      <div className="flex justify-end">
        <Form.Item>
          <Button type="default" htmlType="button" className="mr-4 mt-4" onClick={handleBackStep}>
            Voltar
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={thirdStepMutation.isPending}
            disabled={thirdStepMutation.isPending}
          >
            Salvar
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ThirdStepNewPassword;
