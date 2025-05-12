// hooks/useGetHistory.ts
import { useQuery } from '@tanstack/react-query';
import { getHistory, Message } from './getHistory';

interface UseGetHistoryOptions {
    userId: string | number | undefined | null; // Prop nhận user_id (có thể là undefined/null ban đầu)
    // Có thể thêm các options khác của useQuery tại đây nếu cần
    // onSuccess?: (data: Message[]) => void;
    // onError?: (error: Error) => void;
}

export function useGetHistory({ userId }: UseGetHistoryOptions) {

  return useQuery<Message[], Error>({ 
    queryKey: ['userHistory', userId],

    queryFn: () => getHistory(userId as string | number), // Truyền userId vào hàm fetch

    enabled: !!userId, 

  });
}