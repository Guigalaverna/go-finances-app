import React from "react";
import { Container, ImageContainer, ProviderName } from "./styles";

import { RectButtonProps } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

import GoogleLogo from "../../assets/google.svg";
import AppleLogo from "../../assets/apple.svg";

interface SocialLoginButtonProps extends RectButtonProps {
  provider: "google" | "apple";
}

export function SocialLoginButton({
  provider,
  ...rest
}: SocialLoginButtonProps) {
  return (
    <Container {...rest}>
      <ImageContainer>
        {provider === "google" && (
          <GoogleLogo width={RFValue(24)} height={RFValue(24)} />
        )}
        {provider === "apple" && (
          <AppleLogo width={RFValue(24)} height={RFValue(24)} />
        )}
      </ImageContainer>
      <ProviderName>
        {provider === "google" && "Entrar com Google"}
        {provider === "apple" && "Entrar com Apple"}
      </ProviderName>
    </Container>
  );
}
