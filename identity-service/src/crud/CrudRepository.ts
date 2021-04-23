import HttpException from '../HttpException';
import CrudEntity from './CrudEntity';
import CrudStoring from './CrudStoring';

export default abstract class CrudRepository<T extends CrudEntity>
implements CrudStoring<T> {
  protected store: T[];

  public constructor(store: T[]) {
    this.store = store;
  }

  public create(obj: T): T {
    obj.id = this.genUuidV4();
    this.store.push(obj);
    return obj;
  }

  public readAll(): T[] {
    return this.store;
  }

  public readById(id: string) {
    const match: T = this.store.find((x) => x.id === id);
    if (!match) {
      throw new HttpException(404, `Not found with id ${id}`);
    }
    return match;
  }

  public update(id: string, obj: T) {
    this.delete(id);
    return this.create(obj);
  }

  public delete(id: string) {
    const index = this.store.findIndex((x) => x.id == id);
    if (index > -1) {
      this.store.splice(index, 1);
    }
  }

  private genUuidV4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
      const rand = Math.random() * 16 | 0;
      const num = ch === 'x' ? rand : (rand & 0x3 | 0x8);
      return num.toString(16);
    });
  }
}
