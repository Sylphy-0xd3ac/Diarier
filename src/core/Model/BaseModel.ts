import type { Document, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';

export abstract class BaseModel<T extends Document> {
  protected model: Model<T>;

  constructor(collectionName: string, schema: Schema) {
    this.model = mongoose.model<T>(collectionName, schema) as Model<T>;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(filter: any = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findOne(filter: any): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
