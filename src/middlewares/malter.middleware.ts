import * as express from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

const fileFilter = (
    _request: express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

const multerMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export { multerMiddleware };
