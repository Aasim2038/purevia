"use client";
import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { supabase } from '@/lib/supabaseClient';
import { Toaster, toast } from 'sonner';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const imageInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Skin Care',
    stock: '',
    description: '',
    ingredients: '',
    howToUse: ''
  });

  const categoryPresets: Record<string, { icon: string, bg: string }> = {
    'Skin Care': { icon: '🌿', bg: 'linear-gradient(135deg, #E8F5E0, #C8E6B8)' },
    'Hair Care': { icon: '🥥', bg: 'linear-gradient(135deg, #E8EFF8, #C8D8F0)' },
    'Body Care': { icon: '🪵', bg: 'linear-gradient(135deg, #F5EFEB, #E0CDBA)' },
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load DB products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);

    setImageFiles((prev) => {
      const next = [...prev];
      next[slotIndex] = file;
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      next[slotIndex] = preview;
      return next;
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    setVideoFile(selected);
    setVideoPreview(URL.createObjectURL(selected));
  };



  const clearForm = () => {
    setFormData({ name: '', price: '', category: 'Skin Care', stock: '', description: '', ingredients: '', howToUse: '' });
    setImageFiles([null, null]);
    setImagePreviews([null, null]);
    setVideoFile(null);
    setVideoPreview(null);
    setEditProductId(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (product: any) => {
    setFormData({
      name: product.name || '',
      price: product.price ? String(product.price) : '',
      category: product.category || 'Skin Care',
      stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '0',
      description: product.description || '',
      ingredients: product.ingredients || '',
      howToUse: product.howToUse || ''
    });
    setEditProductId(product.id);
    const existingImages = Array.isArray(product.images) ? product.images : [];
    setImagePreviews([existingImages[0] || null, existingImages[1] || null]);
    setVideoPreview(product.videoUrl || null);
    setImageFiles([null, null]);
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(`Error: ${data.error || 'Failed to delete product'}`);
      }
    } catch (err) {
      toast.error('Error deleting product');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and Price are required.');
      return;
    }
    const selectedImageCount = imageFiles.filter(Boolean).length;
    const existingImageCount = imagePreviews.filter(Boolean).length;
    if (!editProductId && selectedImageCount === 0 && existingImageCount === 0) {
      toast.error('At least one image is required for new products.');
      return;
    }

    setIsSubmitting(true);
    let uploadedImageUrls: string[] = [];
    let uploadedVideoUrl: string | null = null;

    try {
      const currentImageUrls = [...imagePreviews];
      for (let i = 0; i < imageFiles.length; i += 1) {
        const file = imageFiles[i];
        if (!file) continue;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_${i}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('product-images')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
        .from('product-images')
          .getPublicUrl(filePath);
        currentImageUrls[i] = publicUrlData.publicUrl;
      }
      uploadedImageUrls = currentImageUrls.filter((url): url is string => Boolean(url));

      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('product-videos')
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
        .from('product-videos')
          .getPublicUrl(filePath);
        uploadedVideoUrl = publicUrlData.publicUrl;
      } else {
        uploadedVideoUrl = videoPreview;
      }

      const method = editProductId ? 'PATCH' : 'POST';
      const bodyPayload = {
        ...formData,
        imageUrls: uploadedImageUrls,
        videoUrl: uploadedVideoUrl,
        ...(editProductId && { id: editProductId }),
      };

      // 3. Save to DB Action
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      if (res.ok) {
        clearForm();
        toast.success(editProductId ? 'Product updated successfully!' : 'Product added successfully!');
        fetchProducts(); // Auto-refresh table!
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error || 'Failed to save'}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message || 'Server error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <Toaster position="bottom-right" richColors />
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Products</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Inventory Management</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-sage-dark)] text-white text-[0.8rem] tracking-[0.1em] uppercase rounded-full hover:bg-[var(--color-earth-dark)] transition-all shadow-sm hover:-translate-y-0.5 focus:outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-8 py-5 w-[100px]">Image</th>
                    <th className="px-8 py-5 min-w-[200px]">Product Name</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5 text-center">Stock</th>
                    <th className="px-8 py-5 text-right w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 font-serif italic text-[var(--color-text-muted)]">Loading products...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 font-serif italic text-[var(--color-text-muted)]">No products fully synced yet. Click "New Product" to begin building your inventory!</td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const theme = categoryPresets[product.category] || { icon: '📦', bg: '#F5E8F0' };
                      return (
                        <tr key={product.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0 relative group">
                          <td className="px-8 py-4">
                            <div className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl shadow-sm border border-[#EAE6DF] overflow-hidden" style={{ background: theme.bg }}>
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                theme.icon
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-4 font-serif font-medium text-[1.1rem]">{product.name}</td>
                          <td className="px-8 py-4 text-[0.85rem] text-[var(--color-text-muted)]">{product.category}</td>
                          <td className="px-8 py-4 font-serif text-[1rem]">₹{product.price}</td>
                          <td className="px-8 py-4 text-center">
                            <span className={`inline-flex items-center justify-center font-medium w-12 py-1 rounded-full text-[0.8rem] ${
                              product.stock > 20 ? 'bg-[#E8F5E0] text-[var(--color-sage-dark)]' : 
                              product.stock > 0 ? 'bg-[#FFF4E5] text-[#D48806]' : 'bg-[#FCF3F3] text-red-600'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClick(product)} className="p-1.5 text-[var(--color-text-muted)] hover:text-[#0958D9] transition-colors focus:outline-none" aria-label="Edit">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </button>
                              <button onClick={() => handleDeleteClick(product)} className="p-1.5 text-[var(--color-text-muted)] hover:text-red-600 transition-colors focus:outline-none" aria-label="Delete">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pb-20">
          <div className="absolute inset-0 bg-[var(--color-text)]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-[#FDFDFD] w-full max-w-lg rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-[#EAE6DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-[#EAE6DF] bg-white">
              <h3 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">{editProductId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus:outline-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="space-y-3">
                <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)]">
                  Media Uploads (2 Images + 1 Video)
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1].map((slotIndex) => (
                    <button
                      key={`image-slot-${slotIndex}`}
                      type="button"
                      onClick={() => imageInputRefs.current[slotIndex]?.click()}
                      className="w-[92px] h-[92px] bg-[#FAF9F7] rounded-2xl border border-dashed border-[rgba(196,168,130,0.5)] flex flex-col items-center justify-center hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-muted)] gap-2 overflow-hidden"
                    >
                      {imagePreviews[slotIndex] ? (
                        <img src={imagePreviews[slotIndex] || ''} alt={`Image ${slotIndex + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          <span className="text-[0.58rem] uppercase tracking-[0.08em] font-medium">Image {slotIndex + 1}</span>
                        </>
                      )}
                      <input
                        type="file"
                        ref={(el) => { imageInputRefs.current[slotIndex] = el; }}
                        onChange={(e) => handleImageChange(slotIndex, e)}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-[92px] h-[92px] bg-[#FAF9F7] rounded-2xl border border-dashed border-[rgba(196,168,130,0.5)] flex items-center justify-center hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-muted)] overflow-hidden"
                  >
                    {videoPreview ? (
                      <video src={videoPreview} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[0.58rem] uppercase tracking-[0.08em] font-medium">Video</span>
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/*"
                  className="hidden"
                />
              </div>

              {videoPreview && (
                <video src={videoPreview} controls className="w-full rounded-xl border border-[#EAE6DF] max-h-[220px]" />
              )}

              <div className="flex gap-5">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Glowing Serum" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="499" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors">
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Body Care">Body Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Stock Amount</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Brief product description..." className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Ingredients</label>
                <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} placeholder="List ingredients..." className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">How to Use</label>
                <textarea name="howToUse" value={formData.howToUse} onChange={handleChange} rows={3} placeholder="Usage instructions..." className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors resize-none"></textarea>
              </div>
            </div>

            <div className="p-6 bg-[#FAF9F7] border-t border-[#EAE6DF] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[0.75rem] tracking-[0.1em] uppercase font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Cancel</button>
              <button 
                onClick={handleSaveProduct}
                disabled={isSubmitting}
                className={`px-6 py-2.5 text-white text-[0.75rem] tracking-[0.1em] uppercase font-medium rounded-full shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-[var(--color-text)] hover:bg-[var(--color-sage-dark)] hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pb-20">
          <div className="absolute inset-0 bg-[#000000]/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-[#EAE6DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="flex flex-col items-center justify-center mb-5">
                {productToDelete?.images && productToDelete.images.length > 0 ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-[#EAE6DF] mb-3">
                    <img src={productToDelete.images[0]} alt={productToDelete.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-[#FCF3F3] text-red-600 rounded-full flex flex-col items-center justify-center mb-3 border border-red-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-[1.4rem] font-light text-[var(--color-text)] mb-2">Delete Product</h3>
              <p className="text-[0.9rem] text-[var(--color-text-muted)] mb-8 px-2">
                Are you sure you want to delete <strong className="text-[var(--color-text)] hover:underline whitespace-normal break-words">{productToDelete?.name}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  autoFocus
                  className="flex-1 px-6 py-2.5 text-[0.8rem] tracking-[0.05em] uppercase font-medium text-[var(--color-text)] bg-[#F5F3ED] hover:bg-[#EAE6DF] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAE6DF] focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-2.5 text-white text-[0.8rem] tracking-[0.05em] uppercase font-medium rounded-full shadow-md bg-red-600 hover:bg-red-700 transition-all hover:-translate-y-0.5 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
