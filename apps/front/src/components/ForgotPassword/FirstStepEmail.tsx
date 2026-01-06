import { Button, Form, Input } from 'antd';
import { trpc } from '../../utils/trpc';
import type { FirstStepForgotPasswordInput } from '../../../../api/src/user/userValidators';
import type { StepStatus } from '.';

const FirstStepEmail = ({
  setIsOpen,
  setStep,
  setEmailToRecovery,
  setStepStatus,
}: {
  setIsOpen: (isOpen: boolean) => void;
  setStep: (step: number) => void;
  setEmailToRecovery: (email: string) => void;
  setStepStatus: (data: Record<number, StepStatus>) => void;
}) => {
  const [form] = Form.useForm<FirstStepForgotPasswordInput>();

  const firstStepMutation = trpc.auth.firstStepForgotPassword.useMutation({
    onSuccess: () => {
      setStep(1);
      setStepStatus({ 0: 'finish', 1: 'process' });
    },
  });

  const submitEmail = (values: FirstStepForgotPasswordInput) => {
    firstStepMutation.mutate(values);
    setEmailToRecovery(values.email);
  };

  const handleCancel = () => {
    form.resetFields();
    setEmailToRecovery('');
    setIsOpen(false);
  };

  return (
    <Form form={form} layout="vertical" className="w-full" onFinish={submitEmail} disabled={false}>
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

      <div className="flex justify-end">
        <Form.Item>
          <Button type="default" htmlType="button" className="mr-4 mt-4" onClick={handleCancel}>
            Cancelar
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={firstStepMutation.isPending}
            disabled={firstStepMutation.isPending}
          >
            Próximo
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default FirstStepEmail;
