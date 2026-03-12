import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProductReviewsModal({ product, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && product) {
      loadReviews();
    }
  }, [isOpen, product]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/admin/product/${product._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reviews for {product.name}</h2>
            <p className="text-sm text-slate-500">{reviews.length} reviews found</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No reviews yet for this product.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{review.displayName || (review.user?.name) || 'Anonymous'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${review.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {review.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600`}>
                          {review.type?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()} • {review.email || (review.user?.email)}</p>
                    </div>
                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                      <span className="font-bold mr-1">{review.rating}</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{review.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
