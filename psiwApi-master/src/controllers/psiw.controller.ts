import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import { prisma } from './../../prisma/prismaClient'
import { type Request, type Response } from 'express'

const ffprobePromise = async (file: string): Promise<ffmpeg.FfprobeData> => {
  return await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err: Error | null, data: ffmpeg.FfprobeData) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const indexPsiw = async (req: Request, res: Response): Promise<void> => {

}

const findPsiw = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the ID from the request parameters
    const { id } = req.params

    // Use Prisma's findUnique method to find a specific Psiw by its ID
    const psiwData = await prisma.psiw.findUnique({
      where: {
        id // Parse the ID to an integer
      }
    })

    console.log(req.get('host'))

    if (psiwData != null) {
      psiwData.viewedFile = `${req.protocol}://${req.get('host')}/static/${psiwData?.viewedFile}`
      res.status(200).json(psiwData)
    } else {
      res.status(404).json({ error: 'Psiw not found' })
    }
  } catch (error) {
    console.error('Erro ao buscar Psiw:', error)
    res.status(500).json({ error: 'Erro ao buscar Psiw' })
  } finally {
    await prisma.$disconnect() // Close the Prisma client connection
  }
}

const createPsiw = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      psiwType,
      senderName,
      senderWhatsapp,
      recipientName,
      recipientWhatsapp
    } = req.body

    // Verifique se os campos obrigatórios não estão vazios
    if (psiwType === null || senderName === null || senderWhatsapp === null || recipientName === null || recipientWhatsapp === null) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
      return
    }

    // Obtenha o nome do arquivo enviado no campo 'viewedFile' da requisição
    const viewedFileName = req.file?.filename ?? null

    if (viewedFileName !== null) {
      console.log(viewedFileName)
      const psiwFilePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'viewedFiles', viewedFileName)

      // Check if the file is an image or video and rotate if needed
      const isImage = viewedFileName.match(/\.(jpg|jpeg|png|gif)$/i)
      const isVideo = viewedFileName.match(/\.(mp4|avi|mov|mkv)$/i)

      if (isImage !== null) {
        // If it's an image, use sharp to check and rotate
        const metadata = await sharp(psiwFilePath).metadata()
        if ((metadata.width != null) && (metadata.height != null) && metadata.width > metadata.height) {
          // Rotate the image by -90 degrees and save in the same file
          await sharp(psiwFilePath).rotate(90).toBuffer().then(async (data) => {
            await fs.writeFile(psiwFilePath, data)
          })
        }
      } else if (isVideo !== null) {
        // If it's a video, use fluent-ffmpeg to check and rotate
        const metadata = await ffprobePromise(psiwFilePath)
        const width = metadata.streams[0].width as number
        const height = metadata.streams[0].height as number

        if (width > height) {
          const tmpFilePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'viewedFiles', `${viewedFileName}tmp.mp4`)

          await new Promise<void>((resolve, reject): void => {
            ffmpeg()
              .input(psiwFilePath)
              .outputOptions('-vf', 'transpose=1') // Rotate and set the desired dimensions
              .save(tmpFilePath)
              .on('end', async () => {
                console.log('Video rotated and resized successfully.')

                // Delete the original video file
                try {
                  await fs.unlink(psiwFilePath)
                  // Rename the temporary file to the original filename
                  await fs.rename(tmpFilePath, psiwFilePath)
                  resolve()
                } catch (err) {
                  console.error('Error deleting or renaming files:', err)
                  reject(err)
                }
              })
              .on('error', (err) => {
                console.error('Error rotating and resizing video:', err)
                reject(err)
              })
          })
        }
      }

      // Crie um novo registro Psiw com os dados recebidos, incluindo o nome do arquivo
      const newPsiw = await prisma.psiw.create({
        data: {
          psiwType,
          senderName,
          senderWhatsapp,
          recipientName,
          recipientWhatsapp,
          viewedFile: viewedFileName // Adicione o nome do arquivo aqui
        }
      })

      // Retorne o novo Psiw na resposta
      res.status(200).json(newPsiw)
    } else {
      res.status(400).json({ error: 'Arquivo não enviado' })
    }
  } catch (error) {
    console.error('Erro ao criar Psiw:', error)
    res.status(500).json({ error: 'Erro ao criar Psiw' })
  }
}

const updatePsiw = async (req: Request, res: Response): Promise<void> => {

}

const deletePsiw = async (req: Request, res: Response): Promise<void> => {

}

export { indexPsiw, findPsiw, createPsiw, updatePsiw, deletePsiw }
