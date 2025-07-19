import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Tiêu đề và mô tả là bắt buộc" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: {
      title: string;
      description: string;
      imageUrl?: string;
    } = {
      title,
      description,
    };

    // If new image is provided, convert to Base64
    if (image && image.size > 0) {
      try {
        // Validate file size (limit to 5MB for database storage)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
          throw new Error("File quá lớn. Kích thước tối đa là 5MB.");
        }

        // Read file content as ArrayBuffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64
        const base64String = buffer.toString("base64");

        // Create data URL with proper MIME type
        const mimeType = image.type || "image/jpeg";
        updateData.imageUrl = `data:${mimeType};base64,${base64String}`;

        console.log(
          "Base64 encoding successful for update, size:",
          updateData.imageUrl.length
        );
      } catch (uploadError) {
        console.error("Base64 encoding failed during update:", uploadError);
        const errorMessage =
          uploadError instanceof Error
            ? uploadError.message
            : "Không thể xử lý hình ảnh";
        throw new Error(errorMessage);
      }
    }

    const post = await Post.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài đăng" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật bài đăng" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await dbConnect();

    // Get post first to access imageUrl before deletion
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: "Không tìm thấy bài đăng" },
        { status: 404 }
      );
    }

    // With Base64 storage, no need to delete physical files
    // Image data is stored directly in the database

    // Delete post from database
    await Post.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Bài đăng đã được xóa thành công" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { error: "Không thể xóa bài đăng" },
      { status: 500 }
    );
  }
}
