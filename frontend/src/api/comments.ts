import useAuth from "../hooks/useAuth";
import {ApiResponse, ThreadResponse} from './threadAPI'

export const useComments= () => {
  const auth = useAuth();

  const threadQuery = async (
    threadId: number
  ): Promise<ApiResponse<ThreadResponse>> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? "/api/v1"}/threads/comment/${threadId}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${auth.jwt}`, // notice the Bearer before your token
        },
      }
    );
    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      return { data: null, error: jsonResponse.message };
    }

    return {
      data: jsonResponse.payload,
      error: null,
    };
  };

  return { threadQuery };
};
