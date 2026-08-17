import { Button, Form, Input } from 'antd';
import { trpc } from '../../utils/trpc';
import type { StepStatus } from '.';

const SecondStepHash = ({
  emailToRecovery,
  setStep,
  setCode,
  setStepStatus,
}: {
  emailToRecovery: string;
  setStep: (step: number) => void;
  setCode: (code: string) => void;
  setStepStatus: (data: Record<number, StepStatus>) => void;
}) => {
  const [form] = Form.useForm<{ code: string }>();

  const secondStepMutation = trpc.auth.secondStepForgotPassword.useMutation({
    onSuccess: () => {
      setStep(2);
      setStepStatus({ 1: 'finish', 2: 'process' });
    },
    onError: () => {
      setStepStatus({ 1: 'error' });
      form.setFields([
        {
          name: 'code',
          errors: ['Invalid or expired code'],
        },
      ]);
    },
  });

  const submitCode = (values: { code: string }) => {
    secondStepMutation.mutate({ ...values, email: emailToRecovery });

    setCode(values.code);
  };

  const handleBackStep = () => {
    form.resetFields();
    setCode('');
    setStep(0);
    setStepStatus({ 0: 'process', 1: 'wait' });
  };

  return (
    <Form form={form} layout="vertical" className="w-full" onFinish={submitCode} disabled={false}>
      <div className="py-4">A code was sent to your e-mail.</div>

      <Form.Item
        label="Code"
        name="code"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input.OTP size="large" />
      </Form.Item>

      <div className="flex justify-end">
        <Form.Item>
          <Button type="default" htmlType="button" className="mr-4 mt-4" onClick={handleBackStep}>
            Back
          </Button>

          <Button type="primary" htmlType="submit" loading={false} disabled={false}>
            Next
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SecondStepHash;
