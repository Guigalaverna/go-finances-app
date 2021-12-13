import React, { useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';

import { Header } from '../../components/Header';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import { Container, Content, ChartContainer } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

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
  sum: number;
  formattedSum: string;
  percent: string;
}

export function Summary() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const AsyncStorage = useAsyncStorage('@gofinances:transactions');

  async function loadData() {
    const response = await AsyncStorage.getItem();
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: Transaction) => expensive.type === 'outcome'
    );

    const expensivesTotal = expensives.reduce(
      (acumullator: number, expensive: Transaction) => {
        return acumullator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: Transaction) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          sum: categorySum,
          formattedSum: totalFormatted,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <Content contentContainerStyle={{ padding: RFValue(24) }}>
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map(
              category => categories.find(c => c.key === category.key)?.color!
            )}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
            x="percent"
            y="sum"
          />
        </ChartContainer>
        {totalByCategories.map(category => (
          <HistoryCard
            key={category.key}
            category={category.key}
            amount={category.formattedSum}
          />
        ))}
      </Content>
    </Container>
  );
}
