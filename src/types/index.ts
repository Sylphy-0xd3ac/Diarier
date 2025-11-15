import type { NextFunction, Request, Response } from 'express';

export interface Context {
  req: Request;
  res: Response;
  next: NextFunction;
  user?: any;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: number;
}

export interface RouteHandler {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  handler: (ctx: Context) => Promise<any> | any;
  middleware?: Array<(ctx: Context) => Promise<void> | void>;
}

export interface ControllerMetadata {
  prefix: string;
  routes: RouteHandler[];
}

export interface DatabaseConfig {
  uri: string;
  options?: any;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  env: string;
  port: number;
  mongodb: DatabaseConfig;
  jwt: JwtConfig;
}
