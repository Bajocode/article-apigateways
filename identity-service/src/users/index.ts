import Routing from '../Routing';
import UserHandler from './UserHandler';
import UserRepository from './UserRepository';
import UserRoute from './UserRoute';
import User from './User';

const init = (store: User[], userRepo: UserRepository): Routing => {
  const handler = new UserHandler(userRepo);
  const route = new UserRoute(handler);

  return route;
};

export default init;
