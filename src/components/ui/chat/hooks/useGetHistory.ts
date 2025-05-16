// hooks/useGetHistory.ts
import { useQuery } from "@tanstack/react-query";
import { getHistory, Message } from "../../../../../lib/getHistory";

interface UseGetHistoryOptions {
  userId: string | number | undefined | null; // Prop nhận user_id (có thể là undefined/null ban đầu)
  conversation_id: string;
}

export function useGetHistory({ userId,conversation_id }: UseGetHistoryOptions) {
  return useQuery<Message[], Error>({
    queryKey: ["userHistory", userId,conversation_id],

    queryFn: () => getHistory(userId as string | number,conversation_id), // Truyền userId vào hàm fetch

    enabled: !!userId,
  });
}
