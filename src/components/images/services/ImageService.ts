export interface ImageService<T> {
  findImageById(id: string): Promise<T> | never;
  createImage(image: Partial<T>): Promise<T>;
  updateImage(id: string, image: Partial<T>): Promise<T> | never;
  deleteImage(id: string): Promise<void> | never;
}
