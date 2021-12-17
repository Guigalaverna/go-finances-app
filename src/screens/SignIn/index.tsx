import React from "react";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterContent,
} from "./styles";

import Logo from "../../assets/logo.svg";

import { RFValue } from "react-native-responsive-fontsize";
import { SocialLoginButton } from "../../components/SocialLoginButton";

export function SignIn() {
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Logo width={RFValue(200)} height={RFValue(200)} />

          <Title>
            Controle suas {"\n"}
            finances de forma {"\n"}
            muito simples.
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça login com as {"\n"}
          redes socias abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterContent>
          <SocialLoginButton provider="google" />
          <SocialLoginButton provider="apple" />
        </FooterContent>
      </Footer>
    </Container>
  );
}
