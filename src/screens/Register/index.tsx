import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const AsyncStorage = useAsyncStorage('@gofinances:transactions');

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionsTypeSelect(type: 'income' | 'outcome') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert('Campo em branco', 'Selecione o tipo da transação');

    if (category.key === 'category')
      return Alert.alert('Campo em branco', 'Selecione uma categoria');

    const newTransaction = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    };

    try {
      const data = await AsyncStorage.getItem();
      const currentTransactions = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentTransactions, newTransaction];

      await AsyncStorage.setItem(JSON.stringify(dataFormatted));
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar', 'Tente novamente');
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem();

      if (data) {
        console.log(JSON.parse(data));
      }
    }

    loadData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type="income"
                title="Entrada"
                onPress={() => handleTransactionsTypeSelect('income')}
                isActive={transactionType === 'income'}
              />
              <TransactionTypeButton
                type="outcome"
                title="Saída"
                onPress={() => handleTransactionsTypeSelect('outcome')}
                isActive={transactionType === 'outcome'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
