import { BaseController } from '../../core/Controller/BaseController';
import { JwtUtils, PasswordUtils } from '../../core/Utils';
import config from '../config';
import { Config } from '../models/Config';

export class AuthController extends BaseController {
  private configModel = new Config();

  async init() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { password } = this.ctx.request.body;

      if (!password || typeof password !== 'string' || password.length === 0) {
        const response = this.error('Password is required and must be a non-empty string', 400);
        this.send(response);
        return;
      }

      const existing = await this.configModel.getByKey('initialized');
      if (existing) {
        const response = this.error('Application is already initialized', 400);
        this.send(response);
        return;
      }

      const hashedPassword = await PasswordUtils.hash(password);
      await this.configModel.setByKey('masterPassword', hashedPassword);
      await this.configModel.setByKey('initialized', true);

      const response = this.success(
        { message: 'Application initialized successfully' },
        'Initialized',
      );

      this.send(response);
    } catch (_error) {
      const response = this.error('Failed to initialize application');
      this.send(response);
    }
  }

  async login() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { password } = this.ctx.request.body;

      if (!password || typeof password !== 'string') {
        const response = this.error('Password is required', 400);
        this.send(response);
        return;
      }

      const initialized = await this.configModel.getByKey('initialized');
      if (!initialized) {
        const response = this.error('Application is not initialized', 400);
        this.send(response);
        return;
      }

      const masterPassword = await this.configModel.getByKey('masterPassword');
      if (!masterPassword || typeof masterPassword.value !== 'string') {
        const response = this.error('Configuration error: master password not found', 500);
        this.send(response);
        return;
      }

      const isValid = await PasswordUtils.compare(password, masterPassword.value);
      if (!isValid) {
        const response = this.error('Invalid password', 401);
        this.send(response);
        return;
      }

      const token = JwtUtils.sign(
        { authenticated: true, timestamp: Date.now() },
        config.jwt.secret,
        config.jwt.expiresIn,
      );

      const response = this.success(
        {
          token,
          expiresIn: 3600,
        },
        'Login successful',
      );

      this.send(response);
    } catch (_error) {
      const response = this.error('Failed to login');
      this.send(response);
    }
  }
}
