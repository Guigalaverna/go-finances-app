import React, { useContext } from "react";
import * as AuthSession from "expo-auth-session";

import * as AppleAuthentication from "expo-apple-authentication";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

interface ProviderProps {
  children: React.ReactNode;
}

interface ContextData {
  user: User;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | undefined;
}

interface GoogleLoginResponseData {
  type: string;
  params: {
    access_token: string;
  };
}

interface GoogleUserResponseData {
  id: string;
  name: string;
  picture: string;
  email: string;
  given_name: string;
}

export const Context = React.createContext({} as ContextData);

const { GOOGLE_CLIENT_ID: clientId } = process.env;
const { GOOGLE_REDIRECT_URI: redirectUri } = process.env;

export function AuthProvider({ children }: ProviderProps) {
  const [user, setUser] = React.useState<User>({} as User);
  const AsyncStorage = useAsyncStorage("@gofinances:user");

  async function signInWithGoogle() {
    try {
      const responseType = "token";
      const scope = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as GoogleLoginResponseData;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = (await response.json()) as GoogleUserResponseData;

        setUser({
          ...userInfo,
          avatar_url: userInfo.picture,
          name: userInfo.given_name,
        });

        await AsyncStorage.setItem(JSON.stringify(user));
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credentials) {
        const user: User = {
          id: credentials.identityToken!,
          name: credentials.fullName!.givenName!,
          email: credentials.email!,
          avatar_url: undefined,
        };

        setUser(user);
        await AsyncStorage.setItem(JSON.stringify(user));
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
      }}
    >
      {children}
    </Context.Provider>
  );
}
