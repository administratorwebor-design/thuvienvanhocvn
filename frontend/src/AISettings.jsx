import { React, apiClient, useQuery, useMutation, useQueryClient } from './runtime.js';
export function AISettings() {
  const [apiKey, setApiKey] = React.useState('');
  const [model, setModel] = React.useState('gemini-2.5-flash');
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['ai-settings'], queryFn: async () => (await apiClient.get('/admin/ai-settings')).data });
  React.useEffect(() => { if (query.data) setModel(query.data.model); }, [query.data]);
  const save = useMutation({ mutationFn: async () => (await apiClient.patch('/admin/ai-settings', { apiKey, model })).data, onSuccess: () => { setApiKey(''); queryClient.invalidateQueries({ queryKey: ['ai-settings'] }); queryClient.invalidateQueries({ queryKey: ['sgk-chat-status'] }); queryClient.invalidateQueries({ queryKey: ['storybook-chat-status'] }); } });
  return <section className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Cài đặt trợ lý AI</h1>
    <p className="text-gray-600 mb-6">Kết nối Gemini để học sinh hỏi đáp, tạo câu hỏi và flashcard từ tài liệu trong thư viện.</p>
    <p role="status" className="mb-4 text-blue-700">{query.isLoading ? 'Đang tải…' : query.data?.configured ? 'Đã lưu API key. Bạn có thể dùng trợ lý để kiểm tra kết nối.' : 'Chưa có API key.'}</p>
    <form className="space-y-4" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
      <label className="block">Gemini API key<input className="block w-full mt-2 border rounded-lg px-3 py-2" type="password" autoComplete="new-password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder={query.data?.configured ? 'Để trống để giữ key hiện tại' : 'Nhập API key của bạn'} /></label>
      <label className="block">Mô hình<input className="block w-full mt-2 border rounded-lg px-3 py-2" value={model} onChange={e => setModel(e.target.value)} required /></label>
      {(query.isError || save.isError) && <p role="alert" className="text-red-600">{save.error?.response?.data?.error || 'Không tải được cài đặt.'}</p>}
      {save.isSuccess && <p role="status" className="text-green-700">Đã lưu cài đặt.</p>}
      <button className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50" disabled={save.isPending || query.isLoading}>Lưu cài đặt</button>
    </form>
  </section>;
}
