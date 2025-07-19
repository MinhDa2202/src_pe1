'use client';

import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (page = 1, search = '', sort = 'desc') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        search,
        sortBy: 'title',
        sortOrder: sort,
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, sortOrder);
  }, [currentPage, searchTerm, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setCurrentPage(1);
  };


  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPosts(currentPage, searchTerm, sortOrder);
      } else {
        let errorMessage = 'Không thể xóa bài đăng';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        console.error('Error deleting post:', errorMessage);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openCreateModal = () => {
    setError('');
    setEditingPost(null);
    // Use setTimeout to ensure state is updated before opening modal
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  };

  const openEditModal = (post: Post) => {
    setError('');
    setEditingPost(post);
    // Use setTimeout to ensure state is updated before opening modal
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setError('');
  };

  // Stable function to handle form submission - prevents race condition
  const handleModalSubmit = async (formData: FormData) => {
    // Capture the current editing state at the time of submission
    const isEditing = editingPost !== null;
    const postToEdit = editingPost;
    
    if (isEditing && postToEdit) {
      // Edit existing post
      setIsSubmitting(true);
      setError('');
      try {
        const response = await fetch(`/api/posts/${postToEdit._id}`, {
          method: 'PUT',
          body: formData,
        });

        if (response.ok) {
          await fetchPosts(currentPage, searchTerm, sortOrder);
          closeModal();
        } else {
          let errorMessage = 'Không thể cập nhật bài đăng';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
          setError(errorMessage);
        }
      } catch (error) {
        console.error('Error updating post:', error);
        setError('Đã xảy ra lỗi khi cập nhật bài đăng');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Create new post
      setIsSubmitting(true);
      setError('');
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await fetchPosts(currentPage, searchTerm, sortOrder);
          closeModal();
        } else {
          let errorMessage = 'Không thể tạo bài đăng';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
          setError(errorMessage);
        }
      } catch (error) {
        console.error('Error creating post:', error);
        setError('Đã xảy ra lỗi khi tạo bài đăng');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCreatePost={openCreateModal} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Khám Phá Bài Đăng
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Nơi chia sẻ những câu chuyện, ý tưởng và khoảnh khắc đáng nhớ của bạn
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Tìm kiếm bài đăng theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl transition-colors"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSort}
            className="flex items-center gap-2 h-12 px-6 rounded-xl transition-colors"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
            Sắp xếp {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {searchTerm ? (
                <div className="mb-6">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Không có bài đăng nào khớp với từ khóa <strong>&quot;{searchTerm}&quot;</strong>
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="rounded-full px-6"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Chưa có bài đăng nào
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Hãy là người đầu tiên chia sẻ câu chuyện của bạn!
                  </p>
                  <Button 
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Tạo Bài Đăng Đầu Tiên
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEdit={openEditModal}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-12">
                <div className="flex items-center gap-2 bg-card rounded-2xl p-2 shadow-sm border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 rounded-xl hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                        currentPage === page 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="h-10 w-10 rounded-xl hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Pagination Info */}
                <p className="text-sm text-muted-foreground">
                  Hiển thị {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} 
                  {' '}trong tổng số {pagination.total} bài đăng
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Post Modal */}
      <PostModal
        key={editingPost?._id || 'create'}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        post={editingPost}
        isLoading={isSubmitting}
      />
    </div>
  );
}