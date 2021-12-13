import { BorderlessButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
`;

export const ChartContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.ScrollView``;

export const MonthSelect = styled.View`
  width: 100%;
  flex-direction: row;

  justify-content: space-evenly;
  align-items: center;
  margin-top: 24px;
`;

export const MonthSelectButton = styled(BorderlessButton)``;

export const MonthSelectIcon = styled(Feather)`
  font-size: ${RFValue(24)}px;
`;

export const Month = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(20)}px;
`;
