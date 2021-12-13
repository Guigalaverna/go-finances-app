import React from 'react';
import { Header } from '../../components/Header';
import { History, HistoryCard } from '../../components/History';
import { Container } from './styles';

export function Summary() {
  return (
    <Container>
      <Header title="Resumo por categoria" />

      <History>
        <HistoryCard category="food" amount="R$ 150,50" />
        <HistoryCard category="salary" amount="R$ 150,50" />
        <HistoryCard category="car" amount="R$ 150,50" />
      </History>
    </Container>
  );
}
