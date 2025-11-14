import { Document, Schema } from 'mongoose';
import { BaseModel } from '../../core/Model/BaseModel';

export interface IEntry extends Document {
  id: string;
  title: string;
  cipherText: string;
  createdAt: Date;
  updatedAt: Date;
}

const entrySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    cipherText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export class Entry extends BaseModel<IEntry> {
  constructor() {
    super('entries', entrySchema);
  }

  async findByUUID(uuid: string): Promise<IEntry | null> {
    return this.findOne({ id: uuid });
  }

  async getAllEntries(): Promise<IEntry[]> {
    return this.findAll({});
  }

  async deleteByUUID(uuid: string): Promise<IEntry | null> {
    const entry = await this.findByUUID(uuid);
    if (entry) {
      return this.deleteById(entry._id.toString());
    }
    return null;
  }

  async updateByUUID(uuid: string, data: Partial<IEntry>): Promise<IEntry | null> {
    const entry = await this.findByUUID(uuid);
    if (entry) {
      return this.updateById(entry._id.toString(), data);
    }
    return null;
  }
}
