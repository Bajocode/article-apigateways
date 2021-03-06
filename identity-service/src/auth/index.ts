import Routing from '../Routing';
import AuthRepository from './AuthRepository';
import Config from '../Config';
import UserRepository from '../users/UserRepository';
import AuthHandler from './AuthHandler';
import AuthRoute from './AuthRoute';

const init = (
    config: Config,
    userRepo: UserRepository): Routing => {
  const repo = new AuthRepository(config, userRepo);
  const handler = new AuthHandler(repo);
  const route = new AuthRoute(handler);

  return route;
};

export default init;
