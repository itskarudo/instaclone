"use client";
import { graphql } from "@/generated";
import getUrqlClient from "@/utils/getUrqlClient";
import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

interface AccessTokenPayload {
  username: string;
  profilePicURL: string | null;
}

interface AuthContextType {
  username: string | null;
  profilePicURL: string | null;
  login: (usernameOrEmail: string, password: string) => void | Promise<void>;
}

const authContext = createContext<AuthContextType>({
  username: null,
  profilePicURL: null,
  login: () => {},
});

const query = graphql(`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password)
  }
`);

export const AuthContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const client = getUrqlClient();
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const { username, profilePicURL } = jwtDecode(token) as AccessTokenPayload;

    setUsername(username);
    setProfilePicURL(profilePicURL);
  });

  const login = async (usernameOrEmail: string, password: string) => {
    const { data, error } = await client.mutation(query, {
      usernameOrEmail: usernameOrEmail,
      password: password,
    });

    if (error || !data) {
      console.error(error);
      return;
    }

    const token = jwtDecode(data.login) as AccessTokenPayload;

    setUsername(token.username);
    setProfilePicURL(token.profilePicURL);

    localStorage.setItem("access_token", data.login);
  };

  return (
    <authContext.Provider
      value={{
        username,
        profilePicURL,
        login,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default authContext;
