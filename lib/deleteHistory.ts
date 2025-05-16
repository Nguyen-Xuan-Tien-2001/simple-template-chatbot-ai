import axios from "axios";

interface ClearHistoryPayload {
  user_id: string | number;
  conversation_id: string;
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

  const END_POINT = "clear_history";

  try {
    const response = await axios.delete<ClearHistorySuccessResponse>(
      process.env.NEXT_PUBLIC_BASE_URL + END_POINT,
      {
        params: {
          user_id: payload.user_id,
          conversation_id: payload.conversation_id,
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
