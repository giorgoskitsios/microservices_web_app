import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadPath = '/app/uploads/';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

export default upload;
