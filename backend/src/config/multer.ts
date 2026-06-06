import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { env } from "@config/env";
import { AppError } from "@utils/AppError";


const animalsDir = path.resolve(env.UPLOAD_DIR, "animals");
const avatarsDir = path.resolve(env.UPLOAD_DIR, "avatars");

fs.mkdirSync(animalsDir, { recursive: true });
fs.mkdirSync(avatarsDir, { recursive: true });


function buildFilename(file: Express.Multer.File): string {
  const timestamp = Date.now();
  const random    = Math.random().toString(36).slice(2, 8);
  const ext       = path.extname(file.originalname).toLowerCase();
  return `${timestamp}-${random}${ext}`;
}


function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Tipo de arquivo não permitido. Use JPEG, PNG ou WEBP.", 400));
  }
}


const limits = { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 };


export const uploadAnimalImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, animalsDir),
    filename:    (_req, file, cb)  => cb(null, buildFilename(file)),
  }),
  fileFilter,
  limits,
}).single("image");


export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, avatarsDir),
    filename:    (_req, file, cb)  => cb(null, buildFilename(file)),
  }),
  fileFilter,
  limits,
}).single("avatar");
