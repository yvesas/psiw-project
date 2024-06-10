import { prisma } from '../../prisma/prismaClient'
import path from 'path'
import { type Request, type Response } from 'express'
import { fileOverlay } from '../service/fileOverlay.service'

const indexReact = async (req: Request, res: Response): Promise<void> => {

}

const findReact = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the ID from the request parameters
    const { id } = req.params

    // Use Prisma's findUnique method to find a specific Psiw by its ID
    const reactData = await prisma.react.findUnique({
      where: {
        id // Parse the ID to an integer
      }
    })

    if (reactData === null) {
      res.status(404).json({ error: 'Psiw not found' })
      return
    }

    console.log(reactData.id)
    const psiwData = await prisma.psiw.findUnique({
      where: {
        id: reactData.psiwId
      }
    })

    const url = `${req.protocol}://${req.get('host')}/static/`
    const psiwFile = `${url}${psiwData?.viewedFile}`
    const reactFile = `${url}${reactData?.reactedFile}`
    const compiledFile = `${url}${reactData?.compiledFile}`
    const psiwType = psiwData?.psiwType

    res.status(200).json({
      psiwFile,
      reactFile,
      compiledFile,
      psiwType
    })
  } catch (error) {
    console.error('Erro ao buscar Psiw:', error)
    res.status(500).json({ error: 'Erro ao buscar Psiw' })
  } finally {
    await prisma.$disconnect() // Close the Prisma client connection
  }
}

export const downloadReact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const reactData = await prisma.react.findUnique({
      where: {
        id
      }
    })

    if (reactData == null) {
      res.status(404).send('React data not found')
      return
    }

    const fileName = reactData.compiledFile

    if (fileName === null) {
      res.status(404).send('File not found')
      return
    }

    const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'compiledFiles', fileName)

    // Set the Content-Type to force the file as MP4 and as a generic octet-stream
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.mp4"`)
    res.download(filePath, fileName, (err) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (err) {
        res.status(404).send('File not found')
      }
    })
  } catch (error) {
    console.error('Error while downloading React file:', error)
    res.status(500).json({ error: 'Error while downloading React file' })
  } finally {
    await prisma.$disconnect() // Close the Prisma client connection
  }
}

const createReact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { psiwId } = req.body

    // Verifique se os campos obrigatórios não estão vazios
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!psiwId) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
      return
    }

    // Encontre o Psiw com base no ID fornecido
    const psiw = await prisma.psiw.findUnique({
      where: { id: psiwId }
    })

    // Verifique se o Psiw foi encontrado
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!psiw) {
      res.status(404).json({ error: 'Psiw not found' })
      return
    }

    // Obtenha o nome do arquivo enviado no campo 'reactedFile' da requisição
    let reactedFileName = req.file?.filename ?? null
    const viewedFileFileName = psiw.viewedFile ?? null

    if (reactedFileName === null || viewedFileFileName === null) {
      res.status(400).json({ error: 'Arquivos necessários não foram encontrados ou estão incompletos' })
      return
    }

    const compiledFile = await fileOverlay({ psiwType: `${psiw.psiwType}.png`, psiwVideo: viewedFileFileName, reactVideo: reactedFileName })

    // Crie um novo registro React com os dados recebidos, incluindo o nome do arquivo
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!compiledFile) console.log('Compiled file error')

    if ((reactedFileName != null) && reactedFileName.endsWith('.webm')) {
      console.log(reactedFileName)
      reactedFileName = reactedFileName.replace('webm', 'mp4')
      console.log(reactedFileName)
    }

    const newReact = await prisma.react.create({
      data: {
        psiwId: psiw.id, // Associe o React ao Psiw
        reactedFile: reactedFileName,
        compiledFile: compiledFile.compiledVideo
      }
    })

    // Retorne o novo React na resposta
    res.status(200).json(newReact)
  } catch (error) {
    console.error('Erro ao criar React:', error)
    res.status(500).json({ error: 'Erro ao criar React' })
  } finally {
    await prisma.$disconnect() // Close the Prisma client connection
  }
}

const updateReact = async (req: Request, res: Response): Promise<void> => {

}

const deleteReact = async (req: Request, res: Response): Promise<void> => {

}

export { indexReact, findReact, createReact, updateReact, deleteReact }
