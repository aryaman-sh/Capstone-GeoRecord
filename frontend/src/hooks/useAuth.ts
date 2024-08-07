import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthSuccessResponse<T> = {
  data: T;
  error: null;
};

type AuthErrorResponse<T> = {
  data: null;
  error: T;
};

type AuthResponse<T> = AuthSuccessResponse<T> | AuthErrorResponse<string>;

const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [jwt, setJWT] = useState<string | null>(() => localStorage.getItem('jwt'));

  const signUp = async (email: string, name: string, password: string): Promise<AuthResponse<User>> => {
    const signUpData = {
      "email": email,
      "name": name,
      "password": password
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "/api/v1"}/auth/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData)
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        return { data: null, error: jsonResponse.message || 'An unexpected error occurred.' };
      }

      const userData: User = {
        id: jsonResponse.payload.id,
        name: jsonResponse.payload.name,
        email: jsonResponse.payload.email
      };

      setJWT(jsonResponse.payload.jwt);
      localStorage.setItem('jwt', jsonResponse.payload.jwt);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { data: userData, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: 'Failed to sign up due to a network error.' };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse<User>> => {
    const signInData = {
      "email": email,
      "password": password
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "/api/v1"}/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData)
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        return { data: null, error: jsonResponse.message || 'An unexpected error occurred during sign in.' };
      }

      const userData: User = {
        id: jsonResponse.payload.id,
        name: jsonResponse.payload.name,
        email: jsonResponse.payload.email
      };

      setJWT(jsonResponse.payload.jwt);
      localStorage.setItem('jwt', jsonResponse.payload.jwt);

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { data: userData, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: 'Failed to sign in due to a network error.' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setJWT(null);
    setUser(null);
  };

  const signedIn = () => jwt !== null

  return {
    user,
    jwt,
    signUp,
    signIn,
    signOut,
    signedIn
  };
};

export default useAuth;
