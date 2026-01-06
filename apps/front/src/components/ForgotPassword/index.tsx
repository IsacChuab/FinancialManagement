import { useState } from 'react';

import { AiOutlineBarcode, AiOutlineUser } from 'react-icons/ai';
import { MdOutlinePassword } from 'react-icons/md';

import { Modal, Steps } from 'antd';

import FirstStepEmail from './FirstStepEmail';
import SecondStepHash from './SecondStepHash';
import ThirdStepNewPassword from './ThirdStepNewPassword';

export type StepStatus = 'process' | 'wait' | 'finish' | 'error';

const ForgotPassword = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [step, setStep] = useState(0);
  const [emailToRecovery, setEmailToRecovery] = useState('');
  const [code, setCode] = useState('');

  const [stepStatus, setStepStatus] = useState<Record<number, StepStatus>>({
    0: 'process',
    1: 'wait',
    2: 'wait',
  });

  const handleCancel = () => {
    setIsOpen(false);
    setStep(0);
    setEmailToRecovery('');
    setCode('');
    setStepStatus({
      0: 'process',
      1: 'wait',
      2: 'wait',
    });
  };

  return (
    <Modal title="Recuperação de Senha" onCancel={handleCancel} open={isOpen} footer={[]}>
      <Steps
        className="py-4!"
        current={step}
        items={[
          {
            title: 'E-mail',
            status: stepStatus[0],
            icon: <AiOutlineUser />,
          },
          {
            title: 'Código',
            status: stepStatus[1],
            icon: <AiOutlineBarcode />,
          },
          {
            title: 'Nova Senha',
            status: stepStatus[2],
            icon: <MdOutlinePassword />,
          },
        ]}
      />

      {step === 0 && (
        <FirstStepEmail
          setIsOpen={setIsOpen}
          setStep={setStep}
          setEmailToRecovery={setEmailToRecovery}
          setStepStatus={setStepStatus}
        />
      )}

      {step === 1 && (
        <SecondStepHash
          setStep={setStep}
          emailToRecovery={emailToRecovery}
          setCode={setCode}
          setStepStatus={setStepStatus}
        />
      )}

      {step === 2 && (
        <ThirdStepNewPassword
          emailToRecovery={emailToRecovery}
          code={code}
          setIsOpen={setIsOpen}
          setStepStatus={setStepStatus}
        />
      )}
    </Modal>
  );
};

export default ForgotPassword;
