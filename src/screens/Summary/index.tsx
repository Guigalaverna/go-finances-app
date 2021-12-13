import React, { useCallback, useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';

import { Header } from '../../components/Header';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
  Container,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import theme from '../../global/styles/theme';
import { ActivityIndicator } from 'react-native';
import { LoadContainer } from '../Dashboard/styles';
import { useFocusEffect } from '@react-navigation/native';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const AsyncStorage = useAsyncStorage('@gofinances:transactions');

  function handleChangeCurrentMonth(action: 'next' | 'previous') {
    setIsLoading(true);
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const response = await AsyncStorage.getItem();
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: Transaction) =>
        expensive.type === 'outcome' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
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
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header title="Resumo por categoria" />

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Content
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton
                onPress={() => handleChangeCurrentMonth('previous')}
              >
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>

              <Month>
                {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
              </Month>

              <MonthSelectButton
                onPress={() => handleChangeCurrentMonth('next')}
              >
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(
                  category =>
                    categories.find(c => c.key === category.key)?.color!
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
        </>
      )}
    </Container>
  );
}
