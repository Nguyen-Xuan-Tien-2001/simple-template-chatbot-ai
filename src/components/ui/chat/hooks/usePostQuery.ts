// lib/api.ts
import axios from 'axios';

const API_URL = 'http://10.6.18.5:5000/rag'; 

interface QueryPayload {
  query: string; // Dữ liệu bạn muốn gửi đi
  user_id: string | number; // Thay thế bằng kiểu dữ liệu thực tế của user_id
}

interface QueryResponse {
  result: string; // Giả định backend trả về một kết quả dạng chuỗi
  // Thêm các trường khác tùy theo API của bạn
}

export async function postQueryToChatBot(queryPayload: QueryPayload): Promise<QueryResponse> {
  try {
    const response = await axios.post<QueryResponse>(API_URL, queryPayload);
    return response.data;
  } catch (error) {
    // Xử lý lỗi hoặc re-throw để useMutation bắt
    if (axios.isAxiosError(error)) {
      console.error('Axios error posting query:', error.message);
      // Bạn có thể kiểm tra error.response để biết chi tiết lỗi từ server
      throw new Error(error.response?.data?.message || 'An error occurred while posting the query.');
    } else {
      console.error('Unexpected error posting query:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
}