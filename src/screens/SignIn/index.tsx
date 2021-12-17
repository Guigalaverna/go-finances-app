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
import { useAuth } from "../../hooks/useAuth";
import { Alert } from "react-native";

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        "Erro ao fazer login",
        "Ocorreu um erro ao fazer login com Google"
      );
      throw new Error(error);
    }
  }

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
          <SocialLoginButton
            onPress={handleSignInWithGoogle}
            provider="google"
          />
          <SocialLoginButton onPress={signInWithApple} provider="apple" />
        </FooterContent>
      </Footer>
    </Container>
  );
}
