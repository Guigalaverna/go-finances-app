import React, { ReactNode, useContext, useEffect } from "react";
import * as AuthSession from "expo-auth-session";

import * as AppleAuthentication from "expo-apple-authentication";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User | undefined;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  logOut(): void;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

export const Context = React.createContext({} as IAuthContextData);

const { GOOGLE_CLIENT_ID: clientId } = process.env;
const { GOOGLE_REDIRECT_URI: redirectUri } = process.env;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const AsyncStorage = useAsyncStorage("@gofinances:user");

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);

        await AsyncStorage.setItem(JSON.stringify(userLogged));
      }
    } catch (error: any) {
      console.log(error);
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
        const userData: User = {
          id: credentials.identityToken!,
          name: credentials.fullName!.givenName!,
          email: credentials.email!,
          photo: undefined,
        };

        setUser(userData);
        await AsyncStorage.setItem(JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  async function logOut() {
    setUser(undefined);
    await AsyncStorage.removeItem();
  }

  useEffect(() => {
    async function loadUser() {
      const user = await AsyncStorage.getItem();

      if (user) {
        setUser(JSON.parse(user));
      }
    }

    loadUser();
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        logOut,
      }}
    >
      {children}
    </Context.Provider>
  );
}
