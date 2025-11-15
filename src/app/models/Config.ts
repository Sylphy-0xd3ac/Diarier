import { type Document, Schema } from 'mongoose';
import { BaseModel } from '../../core/Model/BaseModel';

export interface IConfig extends Document {
  key: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const configSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export class Config extends BaseModel<IConfig> {
  constructor() {
    super('configs', configSchema);
  }

  async getByKey(key: string): Promise<IConfig | null> {
    return this.findOne({ key });
  }

  async setByKey(key: string, value: unknown): Promise<IConfig> {
    const existing = await this.getByKey(key);
    if (existing) {
      const updated = await this.updateById(existing._id.toString(), { value }) as IConfig;
      return updated;
    }
    return this.create({ key, value });
  } 
}
