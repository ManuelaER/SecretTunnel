import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const result = await response.json();
      console.log("SIGNUP:", result);
      
      if (result.token){
        setToken(result.token)
        setLocation("TABLET");
      }

    } catch (e) {
      console.error("Oh no ;(", e);
    }
  }

  // TODO: authenticate
  async function authenticate(token) {
    if (!token) {
      throw new Error("No token found.");
    }

    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`"Athentication failed"`);
      }

      const result = await response.json();
      console.log("AUTHENTICATE:", result);      

      setLocation("TUNNEL");
    } catch (e) {
      console.error("Auth error:", e);
    }
  }

  const value = { token, signup, authenticate, location };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
