import express from 'express';
import path from 'path';
import helmet from 'helmet';
import hpp from 'hpp';
import {AddressInfo} from 'net';
import {Logger} from 'winston';
import Config from './Config';
import authMiddleware from './middleware/authMiddleware';
import errorMiddleware from './middleware/errorMiddleware';
import traceMiddleware from './middleware/traceMiddleware';
import logMiddleware from './middleware/logMiddleware';
import Routing from './Routing';

export default class App {
  private app: express.Application
  private config: Config
  private logger: Logger

  public constructor(config: Config, logger: Logger, routes: Routing[]) {
    this.app = express();
    this.config = config;
    this.logger = logger;
    this.mountMiddleware();
    this.mountRoutes(routes);
    this.mountErrorMiddleware();
  }

  public listen() {
    const server = this.app.listen(
        this.config.serverPort,
        this.config.serverHost, () => {
          const addr = server.address() as AddressInfo;
          this.logger.info(
              `node pid${process.pid} @ ${addr.address}:${addr.port}`,
          );
        });
    server.keepAliveTimeout = this.config.serverReadTimeout;
    server.requestTimeout = this.config.serverIdleTimeout;

    process.on('SIGTERM', () => {
      this.logger.debug('Graceful shutdown...');
      server.close(() => {
        this.logger.debug('Server stopped');
      });
    });
  }

  public get getServer(): express.Application {
    return this.app;
  }

  private mountMiddleware() {
    if (this.config.isProd) {
      this.app.use(hpp());
      this.app.use(helmet());
    }
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(traceMiddleware());
    this.app.use(logMiddleware(this.logger));
    this.app.use(authMiddleware(this.config));
    this.app.use(express.static(path.join(__dirname, 'static')));
  }

  private mountRoutes(routes: Routing[]) {
    routes.forEach((r) => this.app.use('/', r.router));
  }

  private mountErrorMiddleware() {
    this.app.use(errorMiddleware(this.logger));
  }
}
