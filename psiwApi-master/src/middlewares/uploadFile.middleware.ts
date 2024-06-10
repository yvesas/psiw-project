import multer, { type StorageEngine } from 'multer'
import path from 'path'

const storage = (category: string): StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDestination = path.join(__dirname, '..', '..', 'public', 'uploads', category)
      cb(null, uploadDestination)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
}

export const uploadViewed = multer({
  storage: storage('viewedFiles'),
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/3gpp',
      'video/x-flv',
      'video/webm'
      // Adicione mais tipos MIME aqui, se necessário
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images and videos are allowed'))
    }
  }
})

export const uploadReacted = multer({
  storage: storage('reactedFiles'),
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/3gpp',
      'video/x-flv',
      'video/webm'
      // Adicione mais tipos MIME aqui, se necessário
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images and videos are allowed'))
    }
  }
})
