import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  login: (username: string, password: string) => void;
  logout: () => void;
  user: undefined;
  setUser: Dispatch<SetStateAction<undefined>>;
}

const defaultValues: AuthContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  login: () => undefined,
  logout: () => undefined,
  user: undefined,
  setUser: () => undefined,

};

export const AuthContext = createContext<AuthContextType>(defaultValues);

export const useAuthContext = () => useContext(AuthContext);
