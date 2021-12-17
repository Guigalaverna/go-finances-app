import { useContext } from "react";
import { Context } from "../contexts/AuthContext";

export function useAuth() {
  return useContext(Context);
}
