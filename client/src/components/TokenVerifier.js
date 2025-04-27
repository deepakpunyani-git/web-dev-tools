import { useEffect } from "react";
import { useApolloClient, gql } from "@apollo/client";
import { useLogin } from "../context/LoginContext";
import { toast } from "react-toastify";

const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken($token: String!) {
    verifyToken(token: $token) {
      success
      message
    }
  }
`;

const TokenVerifier = () => {
  const client = useApolloClient();
  const { isAuthenticated, setIsAuthenticated } = useLogin();

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {

        const { data } = await client.query({
            query: VERIFY_TOKEN_QUERY,
            variables: {
              token: localStorage.getItem("authToken"),
            },
            fetchPolicy: "network-only",
          });
          

        if (!data?.verifyToken?.success) {
          throw new Error(data?.verifyToken?.message || "Invalid token");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Session expired. You’ve been logged out.");
        localStorage.clear();
        setIsAuthenticated(false);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [client, isAuthenticated, setIsAuthenticated]);

  return null;
};

export default TokenVerifier;
