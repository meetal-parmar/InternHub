// src/context/AuthContext.jsx
import { createContext, useReducer, useContext } from "react";

const AuthContext = createContext();

const reducer = (state, action) => {
  switch(action.type){
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, { user: null });

  return (
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);