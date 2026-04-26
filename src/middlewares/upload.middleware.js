import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = `uploads/${req.folder}`;
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const uploadSingleImage = (fieldName, folderName) => {
  return (req, res, next) => {
    req.folder = folderName;
    multer({ storage, fileFilter }).single(fieldName)(req, res, next);
  };
};
export const uploadSingleFile = (fieldName, folderName) => {
  return (req, res, next) => {
    req.folder = folderName;
    const upload = multer({ 
      storage, 
      fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
          cb(null, true);
        } else {
          cb(new Error("Only PDF files are allowed for CV"), false);
        }
      } 
    });
    
    upload.single(fieldName)(req, res, next);
  };
};