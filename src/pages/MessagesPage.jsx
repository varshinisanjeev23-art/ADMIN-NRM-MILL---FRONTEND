import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    }
  };

  const handleReply = async (id) => {
    try {
      await api.post(`/admin/messages/${id}/reply`, { reply: replyText });
      setReplyingId(null);
      setReplyText('');
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    }
  };

  const toggleResolved = async (id, current) => {
    try {
      await api.patch(`/admin/messages/${id}`, { replied: !current });
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Support</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Customer Messages</h1>
          <p className="text-slate-600">Reply faster with status badges and quick actions.</p>
        </header>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl">{error}</div>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{msg.name}</h3>
                  <p className="text-slate-500 text-sm">{msg.email}</p>
                  {msg.phone && <p className="text-slate-500 text-sm">{msg.phone}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${msg.replied ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                  {msg.replied ? 'Replied' : 'New'}
                </span>
              </div>

              <p className="mt-4 text-slate-800 leading-relaxed">{msg.message}</p>

              {msg.reply && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-slate-700"><strong>Your Reply:</strong> {msg.reply}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {msg.replied ? (
                  <button
                    onClick={() => toggleResolved(msg._id, msg.replied)}
                    className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Mark as New
                  </button>
                ) : (
                  replyingId === msg._id ? (
                    <div className="w-full space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleReply(msg._id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:shadow-lg"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingId(msg._id)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:shadow-lg"
                    >
                      Reply
                    </button>
                  )
                )}

                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
