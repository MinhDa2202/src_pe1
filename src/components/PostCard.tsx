'use client';

import { useState } from 'react';
// Removed Image import to use regular img tag for Cloudinary URLs
import { Edit, Trash2, Calendar, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if image URL is valid for display
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    // Check if it's a data URL (Base64)
    if (url.startsWith('data:image/')) return true;
    // Check if it's from allowed domains (legacy Cloudinary)
    if (url.includes('res.cloudinary.com')) return true;
    // Check if it's a local upload (legacy)
    if (url.startsWith('/uploads/')) return true;
    // Invalid URLs (like placeholder URLs)
    return false;
  };

  const handleDelete = () => {
    onDelete(post._id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-border">
      {/* Image Container */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {isValidImageUrl(post.imageUrl) && !imageError ? (
          <>
            {/* Use regular img tag for Cloudinary URLs to avoid Vercel optimization issues */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          /* Fallback content when image fails or URL is invalid */
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-background/80 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Hình ảnh không khả dụng</p>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="icon"
            className="h-9 w-9 bg-white/95 hover:bg-white text-gray-800 shadow-xl backdrop-blur-md rounded-full border border-white/50 ring-1 ring-black/10"
            onClick={() => onEdit(post)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 bg-red-500 hover:bg-red-600 text-white shadow-xl backdrop-blur-md rounded-full border border-red-400/50 ring-1 ring-black/10"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 left-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-xl backdrop-blur-md border border-white/50 ring-1 ring-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {post.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Date */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1.5" />
            {formatDate(post.createdAt)}
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>24</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="font-bold text-lg text-card-foreground mb-2">Xác nhận xóa</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bạn có chắc chắn muốn xóa bài đăng <strong>&quot;{post.title}&quot;</strong> không? 
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg"
              >
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}