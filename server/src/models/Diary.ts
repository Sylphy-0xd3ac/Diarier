import mongoose from 'mongoose';

interface IDiary extends mongoose.Document {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const diarySchema = new mongoose.Schema<IDiary>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Diary = mongoose.model<IDiary>('Diary', diarySchema);
