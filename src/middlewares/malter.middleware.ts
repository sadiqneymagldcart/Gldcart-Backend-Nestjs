import * as multer from "multer";
import * as express from "express";

const storage = multer.memoryStorage();

const fileFilter = (
    request: express.Request,
    file: Express.Multer.File,
    cb: any,
) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file format"), false);
    }
};

const multerMiddleware = multer({
    storage: storage,
    // fileFilter: fileFilter,
});

export { multerMiddleware };
