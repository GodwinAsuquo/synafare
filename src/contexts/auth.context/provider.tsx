import { ReactNode } from "react";
import { AuthContext } from "./context";
import usePersistedState from "../../hooks/usePersistedState";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = usePersistedState({
    key: "user",
    defaultValue: undefined,
  });

  const [isLoggedIn, setIsLoggedIn] = usePersistedState({
    key: "loggedIn",
    defaultValue: false,
  });
  const login = (email: string, password: string) => {
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, setIsLoggedIn, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
