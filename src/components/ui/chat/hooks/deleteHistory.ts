import axios from "axios";

interface ClearHistoryPayload {
  user_id: string | number;
}
export interface ClearHistorySuccessResponse {
  message: string;
}

export async function clearHistory(
  payload: ClearHistoryPayload
): Promise<ClearHistorySuccessResponse> {
  if (!payload.user_id) {
    throw new Error("User ID is required to clear history.");
  }

  const API_URL_CLEAR_HISTORY = "http://10.6.18.5:5000/clear_history";

  try {
    const response = await axios.delete<ClearHistorySuccessResponse>(
      API_URL_CLEAR_HISTORY,
      {
        params: {
          user_id: payload.user_id,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error clearing history for user ${payload.user_id}:`,
        error.message
      );

      throw new Error(
        error.response?.data?.message || "Failed to clear user history."
      );
    } else {
      console.error(
        `Unexpected error clearing history for user ${payload.user_id}:`,
        error
      );
      throw new Error("An unexpected error occurred.");
    }
  }
}
