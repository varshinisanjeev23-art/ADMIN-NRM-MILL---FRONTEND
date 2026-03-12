import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import ProductReviewsModal from '../components/ProductReviewsModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const defaultForm = {
  name: '',
  description: '',
  ratePerKg: 0,
  originalPrice: 0,
  rating: 5,
  reviewsCount: 0,
  category: 'Rice',
  status: 'active',
  stockStatus: 'In Stock',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [images, setImages] = useState([null, null, null]);       // 3 image File objects
  const [imagePreviews, setImagePreviews] = useState(['', '', '']); // preview URLs
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);       // DB image URLs when editing
  const [qtyInput, setQtyInput] = useState('');                   // Quantity tag input
  const [qtyOptions, setQtyOptions] = useState([10, 25, 100]);   // Selected qty options
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);
  const fileRefs = [useRef(), useRef(), useRef()];

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = '';
    setImagePreviews(newPreviews);

    const newExisting = [...existingImages];
    newExisting[index] = '';
    setExistingImages(newExisting);

    if (fileRefs[index].current) fileRefs[index].current.value = '';
  };

  const addQtyOption = () => {
    const val = parseInt(qtyInput);
    if (!val || val <= 0 || qtyOptions.includes(val)) return;
    setQtyOptions([...qtyOptions, val].sort((a, b) => a - b));
    setQtyInput('');
  };

  const removeQtyOption = (val) => {
    setQtyOptions(qtyOptions.filter(q => q !== val));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setImages([null, null, null]);
    setImagePreviews(['', '', '']);
    setExistingImages([]);
    setQtyOptions([10, 25, 100]);
    setQtyInput('');
    setEditingId(null);
    fileRefs.forEach(r => { if (r.current) r.current.value = ''; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('ratePerKg', form.ratePerKg);
      formData.append('originalPrice', form.originalPrice);
      formData.append('rating', form.rating);
      formData.append('reviewsCount', form.reviewsCount);
      formData.append('category', form.category);
      formData.append('status', form.status);
      formData.append('stockStatus', form.stockStatus);
      formData.append('quantityOptions', JSON.stringify(qtyOptions));

      // Append new image files
      images.forEach(img => {
        if (img) formData.append('images', img);
      });

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Product updated!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Product added!');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        loadProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      ratePerKg: p.ratePerKg,
      originalPrice: p.originalPrice || 0,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      category: p.category,
      status: p.status,
      stockStatus: p.stockStatus,
    });
    setEditingId(p._id);
    // Prefill existing images for preview
    const existing = (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [p.imageUrl] : []);
    const padded = [...existing, '', '', ''].slice(0, 3);
    setExistingImages(padded);
    setImagePreviews(padded.map(u => u ? `${API_BASE}${u}` : ''));
    setImages([null, null, null]);
    setQtyOptions(p.quantityOptions && p.quantityOptions.length > 0 ? p.quantityOptions : [10, 25, 100]);
    setQtyInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Catalog</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Product Management</h1>
          <p className="text-slate-600">Add, edit, and remove rice products with images and quantity options.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
          {/* ── FORM ── */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm}
                  className="text-sm px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input type="text" placeholder="Product name" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea placeholder="Short description" value={form.description} rows={3}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Sale Price (₹/kg)</label>
                  <input type="number" placeholder="0" value={form.ratePerKg} required
                    onChange={(e) => setForm({ ...form, ratePerKg: Number(e.target.value) })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Original Price (₹/kg)</label>
                  <input type="number" placeholder="0" value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Rating (1–5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Reviews Count</label>
                  <input type="number" value={form.reviewsCount}
                    onChange={(e) => setForm({ ...form, reviewsCount: Number(e.target.value) })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Rice</option>
                    <option>Traditional Rice</option>
                    <option>Black Rice</option>
                    <option>Red Rice</option>
                    <option>White Rice</option>
                    <option>Aromatic Rice</option>
                    <option>Unpolished Rice</option>
                    <option>Medicinal Rice</option>
                    <option>Wheat</option>
                    <option>Daily Use Rice</option>
                    <option>Organic Rice</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Stock Status */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Stock Status</label>
                <select value={form.stockStatus} onChange={(e) => setForm({ ...form, stockStatus: e.target.value })}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              {/* ── QUANTITY OPTIONS ── */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Quantity Options (kg)</label>
                <div className="flex gap-2 flex-wrap">
                  {qtyOptions.map(q => (
                    <span key={q} className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                      {q}kg
                      <button type="button" onClick={() => removeQtyOption(q)}
                        className="ml-1 text-green-500 hover:text-red-500 font-bold leading-none">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Add kg (e.g. 50)"
                    value={qtyInput}
                    min="1"
                    onChange={(e) => setQtyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQtyOption())}
                    className="flex-1 border border-slate-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button type="button" onClick={addQtyOption}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700">
                    + Add
                  </button>
                </div>
                <p className="text-xs text-slate-400">These are the weight buttons shown to customers on the product page.</p>
              </div>

              {/* ── 3 IMAGE UPLOAD ── */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Images (up to 3)</label>
                <p className="text-xs text-slate-400">First image is the primary/thumbnail. Uploading new images replaces all existing ones.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`aspect-square rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-colors
                          ${imagePreviews[idx] ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50'}`}
                        onClick={() => fileRefs[idx].current?.click()}
                      >
                        {imagePreviews[idx] ? (
                          <img src={imagePreviews[idx]} alt={`Image ${idx + 1}`} className="w-full h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400 p-2">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[10px] font-semibold text-center">
                              {idx === 0 ? 'Main Image' : `Image ${idx + 1}`}
                            </span>
                          </div>
                        )}
                      </div>
                      {imagePreviews[idx] && (
                        <button type="button" onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow">
                          ×
                        </button>
                      )}
                      <input
                        ref={fileRefs[idx]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(idx, e.target.files[0])}
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">PRIMARY</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:shadow-lg transition-shadow">
                {editingId ? '✅ Update Product' : '➕ Add Product'}
              </button>
            </form>
          </div>

          {/* ── PRODUCT TABLE ── */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="p-4 text-left w-20 align-middle">Images</th>
                    <th className="p-4 text-left align-middle">Details</th>
                    <th className="p-4 text-left align-middle">Price</th>
                    <th className="p-4 text-left align-middle">Status</th>
                    <th className="p-4 text-left align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  {products.map((p) => {
                    const imgList = (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [p.imageUrl] : []);
                    return (
                      <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-4 align-middle">
                          <div className="flex gap-1">
                            {imgList.slice(0, 3).map((url, i) => (
                              <div key={i} className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                                <img src={`${API_BASE}${url}`} alt="" className="w-full h-full object-contain" />
                              </div>
                            ))}
                            {imgList.length === 0 && (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{p.description}</div>
                          <div className="text-[10px] mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold uppercase">{p.category}</div>
                          {p.quantityOptions && p.quantityOptions.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {p.quantityOptions.map(q => (
                                <span key={q} className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-bold">{q}kg</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="font-bold text-green-600">₹{p.ratePerKg}/kg</div>
                          {p.originalPrice > 0 && <div className="text-xs text-slate-400 line-through">₹{p.originalPrice}/kg</div>}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1 text-sm font-bold text-amber-500 mb-1">
                            <span>★</span>{p.rating}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.status || 'active'}
                          </span>
                          <div className="mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {p.stockStatus || 'In Stock'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <button onClick={() => setSelectedProductForReviews(p)}
                              className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm">
                              Reviews
                            </button>
                            <button onClick={() => handleEdit(p)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p._id)}
                              className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-sm">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ProductReviewsModal 
        product={selectedProductForReviews} 
        isOpen={!!selectedProductForReviews} 
        onClose={() => setSelectedProductForReviews(null)} 
      />
    </div>
  );
}
