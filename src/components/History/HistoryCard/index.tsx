import React from 'react';
import { categories } from '../../../utils/categories';
import { Container, Title, Amount } from './styles';

interface HistoryCardProps {
  category: string;
  amount: string;
}

export function HistoryCard({
  category: categoryKey,
  amount,
}: HistoryCardProps) {
  const [category] = categories.filter(
    category => category.key === categoryKey
  );

  return (
    <Container color={category.color}>
      <Title>{category.name}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
