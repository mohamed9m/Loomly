import { createContext, useContext } from "react";

const AuthContext = createContext(undefined);

const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("useAuth must be used within auth provider");
  return authContext;
};
export { AuthContext, useAuth };
