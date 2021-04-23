import App from './App';
import Config from './Config';
import LogFactory from './LogFactory';
import health from './health';
import users from './users';
import auth from './auth';
import UserRepository from './users/UserRepository';

const cfg = new Config();
const logger = LogFactory.create(cfg);
const store = [];
const userRepo = new UserRepository(store);
const app = new App(cfg, logger, [
  health(),
  users(store, userRepo),
  auth(cfg, userRepo),
]);

app.listen();
