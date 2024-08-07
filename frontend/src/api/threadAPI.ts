import useAuth from "../hooks/useAuth";

export type ApiSuccessResponse<T> = {
  data: T;
  error: null;
};

export type ApiErrorResponse<T> = {
  data: null;
  error: T;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse<string>;

interface Comment {
  comment_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

// UPDATE THIS WHEN ARY IS DONE
interface ThreadResponse {
  thread_id: string;
  title: string;
  description: string;
  created_at: string;
  comments: Comment[];
}

interface NewThreadResponse {
  thread_id: string;
  title: string;
  description: string;
}


export const useThreads = () => {
  const auth = useAuth();

  const threadQuery = async (
    polygonId: number
  ): Promise<ApiResponse<ThreadResponse>> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? "/api/v1"}/threads/${polygonId}`,
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

    if (jsonResponse.detail == "Not Found") {
      return {
        data: null,
        error: "Not Found",
      };
    }

    if (jsonResponse.error) {
      return { data: null, error: jsonResponse.message };
    }

    return {
      data: jsonResponse.payload,
      error: null,
    };
  };

  const createThread = async (location_id: string, thread_name: string, description: string): Promise<ApiResponse<NewThreadResponse>> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? "/api/v1"}/threads/${location_id}`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_id: location_id,
          title: thread_name,
          descript: description,
        }),
      }
    );

    if (!response.ok) {
      return {
        data: null,
        error: "Unable to create thread"
      }
    }

    const responseValue = await response.json();

    return {
      data: {
        title: responseValue.payload.name,
        description: responseValue.payload.description,
        thread_id: responseValue.payload.thread_id,
      },
      error: null
    }
    };


  return { threadQuery, createThread };
};
