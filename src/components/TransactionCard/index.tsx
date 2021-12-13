import React from 'react';
import { categories } from '../../utils/categories';
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
  Header,
  DeleteButton,
} from './styles';

export interface TransactionCardProps {
  type: 'income' | 'outcome';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
  handleDeleteTransaction?: () => void;
}

export function TransactionCard({ data, handleDeleteTransaction }: Props) {
  const [category] = categories.filter(item => item.key === data.category);

  return (
    <Container>
      <Header>
        <Title>{data.name}</Title>
        <DeleteButton onPress={handleDeleteTransaction}>
          <Icon name="trash-2" />
        </DeleteButton>
      </Header>

      <Amount type={data.type}>
        {data.type === 'outcome' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>

        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
