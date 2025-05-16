// lib/api.ts
import axios from "axios";
// Giữ lại các hàm và interfaces khác nếu có

export interface conversation {
  conversation_id: string;
  conversation_title: string;
}

// Định nghĩa kiểu dữ liệu cho response từ API history
// Dựa trên cấu trúc response bạn cung cấp trước đó, giả định GET history cũng có key 'data' chứa mảng
interface GetHistoryResponseData {
  data: conversation[];
}

export async function getConversations(
  userId: string | number
): Promise<conversation[]> {
  // Kiểm tra user_id trước khi fetch (tùy chọn, có thể xử lý bằng `enabled` trong useQuery)
  if (!userId) {
    console.warn("getHistory called without a valid userId");
    return []; // Hoặc null tùy thuộc vào cách bạn muốn xử lý ở component
  }

  const END_POINT = "conversations";

  try {
    // Sử dụng axios.get với URL và truyền tham số query qua 'params'
    // <GetHistoryResponseData> chỉ định kiểu dữ liệu của response.data
    const response = await axios.get<GetHistoryResponseData>(
      process.env.NEXT_PUBLIC_BASE_URL + END_POINT,
      {
        params: {
          user_id: userId, // Truyền user_id như query parameter
        },
      }
    );

    // Trả về mảng tin nhắn nằm trong key 'data' của response body
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error fetching history for user ${userId}:`,
        error.message
      );
      // Ném lỗi với thông báo từ server nếu có, hoặc thông báo chung
      throw new Error(
        error.response?.data?.message || "Failed to fetch user history."
      );
    } else {
      console.error(
        `Unexpected error fetching history for user ${userId}:`,
        error
      );
      throw new Error("An unexpected error occurred.");
    }
  }
}
