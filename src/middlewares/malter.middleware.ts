import * as express from "express";
import multer from "multer";

const storage = multer.memoryStorage();

// Allow pdf, docs and txt and images
const fileFilter = (
    request: express.Request,
    file: Express.Multer.File,
    cb: any,
) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/pdf" ||
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "text/plain"
    ) {
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
