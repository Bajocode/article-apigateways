import CrudEntity from '../crud/CrudEntity';

abstract class User implements CrudEntity {
  public constructor(
    public email: string,
    public password: string,
    public id?: string,
  ) {}
}

export default User;
