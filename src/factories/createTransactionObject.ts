import uuid from 'react-native-uuid';

interface Transaction {
  id?: string | number[];
  name: string;
  amount: string;
  transactionType: 'income' | 'outcome';
  category: string;
  date?: Date;
}

export function createTransactionObject(data: Transaction): Transaction {
  const transactionObject = {
    ...data,
    date: new Date(),
    id: String(uuid.v4()),
  } as Transaction;

  return transactionObject;
}
