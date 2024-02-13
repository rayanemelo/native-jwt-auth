import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

type AuthProps = {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
};

type AuthProvider = {
  children: JSX.Element | JSX.Element[];
};

const TOKEN_KEY = "my-jwt";
export const API_URL = "https://api.developbetterapps.com";

const AuthContext = createContext<AuthProps>({} as AuthProps);

export const AuthProvider = ({ children }: AuthProvider) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  async function getToken() {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({ token, authenticated: true });
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  async function register(email: string, password: string) {
    try {
      return await axios.post(`${API_URL}/users`, {
        email,
        password,
      });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth`, {
        email,
        password,
      });

      setAuthState({
        token: response.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

      return response;
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({
      token: null,
      authenticated: false,
    });

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState: authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
