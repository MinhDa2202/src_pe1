import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);