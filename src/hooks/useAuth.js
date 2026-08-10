// This is a small shortcut so components can write:
//   const { user, login, logout } = useAuth();
// instead of the longer:
//   const { user, login, logout } = useContext(AuthContext);

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);