'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  post?: Post | null;
  isLoading?: boolean;
}

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  post,
  isLoading = false,
}: PostModalProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post?.imageUrl || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    } else if (title.length > 100) {
      newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
    }

    if (!description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    } else if (description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    if (!post && !imageFile) {
      newErrors.image = 'Hình ảnh là bắt buộc';
    }

    // Validate image file if provided
    if (imageFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        newErrors.image = 'Kích thước file quá lớn. Tối đa 10MB.';
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
        newErrors.image = 'Định dạng file không hợp lệ. Chỉ hỗ trợ JPEG, PNG, WebP và GIF.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    setTitle(post?.title || '');
    setDescription(post?.description || '');
    setImageFile(null);
    setImagePreview(post?.imageUrl || '');
    setErrors({});
    onClose();
  };

  // Fixed: Handle onOpenChange properly - when open changes to false, call handleClose
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 border border-sky-200 shadow-2xl shadow-sky-500/20 rounded-3xl">
        <DialogHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200/30 to-transparent rounded-t-3xl"></div>
          <DialogTitle className="text-2xl font-black text-center mb-4 text-sky-700 relative z-10">
            {post ? '✨ Chỉnh Sửa Bài Đăng ✨' : '🚀 Tạo Bài Đăng Mới 🚀'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="space-y-3">
            <label className="text-lg font-bold block text-sky-700">
              📝 Tiêu đề <span className="text-red-500 animate-pulse">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="💡 Nhập tiêu đề bài đăng siêu hấp dẫn..."
              className={`bg-white/70 border-2 ${errors.title ? 'border-red-500 animate-shake' : 'border-sky-300 focus:border-sky-500'} text-sky-800 placeholder:text-sky-400 rounded-2xl px-4 py-3 text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/90 focus:ring-4 focus:ring-sky-200`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 flex items-center animate-bounce">
                ❌ {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-lg font-bold block text-sky-700">
              📄 Mô tả <span className="text-red-500 animate-pulse">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="✨ Mô tả chi tiết về bài đăng của bạn..."
              rows={5}
              className={`bg-white/70 border-2 ${errors.description ? 'border-red-500 animate-shake' : 'border-sky-300 focus:border-sky-500'} text-sky-800 placeholder:text-sky-400 rounded-2xl px-4 py-3 text-lg font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/90 focus:ring-4 focus:ring-sky-200 resize-none`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2 flex items-center animate-bounce">
                ❌ {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-lg font-bold block text-sky-700">
              🖼️ Hình ảnh {!post && <span className="text-red-500 animate-pulse">*</span>}
            </label>
            
            {imagePreview ? (
              <div className="relative group">
                <div className="relative w-full h-56 rounded-3xl overflow-hidden border-2 border-sky-300 shadow-2xl shadow-sky-500/30 hover:shadow-blue-500/30 transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  className="absolute top-4 right-4 h-12 w-12 bg-red-500/90 hover:bg-red-600 text-white shadow-2xl backdrop-blur-md rounded-full border-2 border-white/30 ring-2 ring-red-500/50 hover:ring-red-400/70 transition-all duration-300 hover:scale-110"
                  onClick={removeImage}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <div
                className={`border-3 border-dashed rounded-3xl p-8 text-center cursor-pointer hover:scale-105 transition-all duration-300 ${
                  errors.image ? 'border-red-500 bg-red-50 animate-shake' : 'border-sky-300 hover:border-blue-400 bg-white/50 hover:bg-white/70'
                } backdrop-blur-sm`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-sky-500 group-hover:text-blue-600 transition-colors animate-bounce" />
                <p className="text-lg text-sky-700 font-semibold">
                  🎨 Nhấp để chọn hình ảnh tuyệt đẹp
                </p>
                <p className="text-sm text-sky-500 mt-2">
                  JPEG, PNG, WebP, GIF - Tối đa 10MB
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {errors.image && (
              <p className="text-red-400 text-sm mt-2 flex items-center animate-bounce">
                ❌ {errors.image}
              </p>
            )}
          </div>

          <DialogFooter className="pt-6 space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="px-8 py-3 rounded-2xl border-2 border-sky-300 text-sky-600 hover:text-sky-700 hover:border-sky-400 bg-white/70 hover:bg-white/90 backdrop-blur-sm transition-all duration-300 font-semibold text-lg hover:scale-105"
            >
              ❌ Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 hover:from-sky-400 hover:via-blue-400 hover:to-sky-500 text-white shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 font-bold text-lg hover:scale-105 hover:-translate-y-1 border-2 border-white/20"
            >
              {isLoading ? (
                <span className="flex items-center">
                  ⏳ Đang xử lý... <span className="ml-2 animate-spin">🔄</span>
                </span>
              ) : (
                <span>{post ? '✅ Cập Nhật' : '🚀 Tạo Mới'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}