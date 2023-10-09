export interface ImageRepo<T> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  updateOne(id: string, data: Partial<T>): Promise<T | null>;
  deleteOne(id: string): Promise<boolean>;
}
