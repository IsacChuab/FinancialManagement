export const formatBrlMoney = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value > 0 ? value : 0);
};

export const checkStatusBill = (isPaid: boolean, dueDate: Date) => {
  const currentDate = new Date();

  if (isPaid) {
    return 'paid';
  }

  if (currentDate > dueDate) {
    return 'late';
  }

  return 'pending';
};
