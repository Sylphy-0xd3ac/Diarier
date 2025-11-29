import 'koa';

declare module 'koa' {
  interface Request {
    body?: any;
  }
}

declare module 'koa-bodyparser' {
  import type { Middleware } from 'koa';
  const bodyParser: (options?: any) => Middleware;
  export default bodyParser;
}
