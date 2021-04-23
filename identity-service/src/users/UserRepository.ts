import CrudRepository from '../crud/CrudRepository';
import User from './User';
import HttpException from '../HttpException';

export default class UserRepository extends CrudRepository<User> {
  public constructor(store: User[]) {
    super(store);
  }

  public readByEmail(email: string): User {
    const match = this.getByEmail(email);
    if (!match) {
      throw new HttpException(404, `User not found with email: ${email}`);
    }
    return match;
  }

  public create(user: User): User {
    const match = this.getByEmail(user.email);
    if (match) {
      throw new HttpException(409, `Email ${user.email} exists`);
    }
    return super.create(user);
  }

  private getByEmail(email: string): User | undefined {
    return this.store.find((u) => u.email === email);
  }
}
