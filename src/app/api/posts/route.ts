import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/posts - Starting request');
    
    // Connect to database
    await dbConnect();
    console.log('Database connected successfully');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('Query params:', { page, limit, search, sortBy, sortOrder });

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    // Build sort object
    const sortObject: { [key: string]: 1 | -1 } = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    console.log('Executing database queries...');
    
    const posts = await Post.find(searchQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(searchQuery);

    console.log(`Found ${posts.length} posts, total: ${total}`);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách bài đăng' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/posts - Starting request');

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    console.log('Form data:', { title, description, imageSize: image?.size });

    if (!title || !description || !image) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Tất cả các trường đều bắt buộc' },
        { status: 400 }
      );
    }

    console.log('Starting Base64 encoding...');
    // Convert image to Base64 and store in database
    let imageUrl;
    try {
      // Validate file size (limit to 5MB for database storage)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (image.size > maxSize) {
        throw new Error('File quá lớn. Kích thước tối đa là 5MB.');
      }

      // Read file content as ArrayBuffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert to Base64
      const base64String = buffer.toString('base64');
      
      // Create data URL with proper MIME type
      const mimeType = image.type || 'image/jpeg';
      imageUrl = `data:${mimeType};base64,${base64String}`;
      
      console.log('Base64 encoding successful, size:', imageUrl.length);
    } catch (uploadError) {
      console.error('Base64 encoding failed:', uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Không thể xử lý hình ảnh';
      throw new Error(errorMessage);
    }

    console.log('Connecting to database...');
    await dbConnect();

    console.log('Creating post in database...');
    const post = await Post.create({
      title,
      description,
      imageUrl,
    });

    console.log('Post created successfully:', post._id);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Không thể tạo bài đăng' },
      { status: 500 }
    );
  }
}