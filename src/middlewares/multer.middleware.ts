import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      const suffix  = Math.random()*10;
      cb(null, file.originalname+suffix)
    }
  })
  
export const upload = multer({ 
    storage, 
})