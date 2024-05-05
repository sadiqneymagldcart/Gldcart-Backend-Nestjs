export interface IStorage {
     upload(files: Express.Multer.File[]): Promise<string[]>;
}
