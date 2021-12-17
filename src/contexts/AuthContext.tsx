import React, { useContext } from "react";
import * as AuthSession from "expo-auth-session";

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
  avatar_url: string;
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

export function AuthProvider({ children }: ProviderProps) {
  const [user, setUser] = React.useState<User>({} as User);

  async function signInWithGoogle() {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;

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
