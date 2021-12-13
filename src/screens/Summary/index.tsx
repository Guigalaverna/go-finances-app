import React, { useState } from 'react';

import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { History, HistoryCard } from '../../components/History';
import { Container } from './styles';
import { categories } from '../../utils/categories';
import { FlatList } from 'react-native';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  category: string;
  type: 'income' | 'outcome';
  date: Date;
}

interface CategoryData {
  key: string;
  name: string;
  sum: string;
}

export function Summary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const AsyncStorage = useAsyncStorage('@gofinances:transactions');

  useFocusEffect(
    React.useCallback(() => {
      async function loadData() {
        const data = await AsyncStorage.getItem();
        const parsedData = data ? JSON.parse(data) : [];

        setTransactions(parsedData);
        sumByCategory();
      }

      loadData();
    }, [])
  );

  function sumByCategory() {
    // sum all outcomes by category
    const allOutcomeTransactions = transactions.filter(
      transaction => transaction.type === 'outcome'
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      allOutcomeTransactions.forEach(transaction => {
        if (transaction.category === category.key) {
          categorySum += Number(transaction.amount);
        }
      });

      if (categorySum > 0) {
        totalByCategory.push({
          key: category.key,
          name: category.name,
          sum: formatAmount(categorySum),
        });
      }
    });

    setTotalByCategories(totalByCategory);
    console.log(totalByCategory);
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <History>
        {totalByCategories?.map(category => (
          <HistoryCard
            key={category.key}
            category={category.key}
            amount={category.sum}
          />
        ))}
      </History>
    </Container>
  );
}
