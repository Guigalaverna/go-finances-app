import React from 'react';
import { Container } from './styles';

interface HistoryProps {
  children: React.ReactNode;
}

export function History({ children }: HistoryProps) {
  return <Container>{children}</Container>;
}

export { HistoryCard } from './HistoryCard';
