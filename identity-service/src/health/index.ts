import Routing from '../Routing';
import HealthRoute from './HealthRoute';

const init = (): Routing => {
  return new HealthRoute();
};

export default init;
