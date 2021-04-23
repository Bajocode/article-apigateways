interface CrudStoring<T> {
  create(obj: T): T;
  readAll(): T[];
  readById(id: string): T;
  update(id: string, obj: T): T;
  delete(id: string): void;
}

export default CrudStoring;
