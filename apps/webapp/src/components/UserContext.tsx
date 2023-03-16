import { User } from "@types";
import { createContext } from "react";

type ContextType = {
  user?: User;
  setUser?: (_val?: User) => void;
};

export const UserContext = createContext<ContextType>({});
