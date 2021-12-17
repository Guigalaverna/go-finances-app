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
import { Alert, Platform } from "react-native";

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert(
        "Erro ao fazer login",
        "Ocorreu um erro ao fazer login com Google"
      );
      console.error(error);
    }
  }

  async function handleSignInWithApple() {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert(
        "Erro ao fazer login",
        "Ocorreu um erro ao fazer login com Apple"
      );
      console.error(error);
    }
  }
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Logo width={RFValue(200)} height={RFValue(200)} />

          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"}
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
          {Platform.OS === "ios" && (
            <SocialLoginButton
              onPress={handleSignInWithApple}
              provider="apple"
            />
          )}
        </FooterContent>
      </Footer>
    </Container>
  );
}
