import { BaseController } from '../../core/Controller/BaseController';
import { Database } from '../../core/Database';
import { Config } from '../models/Config';

export class StatusController extends BaseController {
  private configModel = new Config();

  async getStatus() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const config = await this.configModel.getByKey('initialized');
      const isInitialized = !!config?.value;

      const response = this.success(
        {
          status: isInitialized ? 'initialized' : 'uninitialized',
          server: 'running',
          timestamp: new Date().toISOString(),
        },
        'Status retrieved successfully',
      );

      this.send(response);
    } catch (_error) {
      const response = this.error('Failed to retrieve status');
      this.send(response);
    }
  }

  async getHealth() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const response = this.success(
        {
          status: 'ok',
          timestamp: new Date().toISOString(),
          database: Database.isConnected() ? 'connected' : 'disconnected',
        },
        'Health check passed',
      );

      this.send(response);
    } catch (_error) {
      const response = this.error('Health check failed', 503);
      this.send(response);
    }
  }
}
