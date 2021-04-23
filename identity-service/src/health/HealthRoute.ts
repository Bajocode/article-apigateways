import {Router} from 'express';
import Routing from '../Routing';

export default class HealthRoute implements Routing {
  public path = '/status';
  public router = Router();

  public constructor() {
    this.router.get(`${this.path}/healthz`, (req, res) => {
      res.status(200).send();
    });
    this.router.get(`${this.path}/readyz`, (req, res) => {
      res.status(200).send();
    });
  }
}
