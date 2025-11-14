import mongoose from 'mongoose';
import { DatabaseConfig } from '../../types';

export class Database {
  static async connect(config: DatabaseConfig): Promise<void> {
    try {
      await mongoose.connect(config.uri, config.options || {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✓ MongoDB connected successfully');
    } catch (error) {
      console.error('✗ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('✓ MongoDB disconnected');
    } catch (error) {
      console.error('✗ MongoDB disconnection error:', error);
    }
  }

  static isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
