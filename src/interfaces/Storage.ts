export interface Storage {
     upload(files: Express.Multer.File[]): Promise<string[]>;
}
