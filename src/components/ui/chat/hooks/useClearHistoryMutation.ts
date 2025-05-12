import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearHistory,ClearHistorySuccessResponse } from "./deleteHistory";

export function useClearHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ClearHistorySuccessResponse,
    Error,
    { user_id: string | number }
  >({
    mutationFn: clearHistory,

    onSuccess: (data, variables) => {
      console.log(
        `History cleared successfully for user ${variables.user_id}:`,
        data
      );

      queryClient.invalidateQueries({
        queryKey: ["userHistory", variables.user_id],
      });

    },

    onError: (error) => {
      console.error("Error clearing history:", error);
    },
  });
}
