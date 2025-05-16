// hooks/useConversations.ts
import { useQuery } from '@tanstack/react-query';
import { getConversations,conversation } from '@/lib/getConversations';

interface UseConversationsOptions {
    userId: string | number | undefined | null; 
}

export function useConversations({ userId }: UseConversationsOptions) {

  return useQuery<conversation[], Error>({ 
    queryKey: ['userConversations', userId],

    queryFn: () => getConversations(userId as string | number), // Truyền userId vào hàm fetch

    enabled: !!userId, 

  });
}