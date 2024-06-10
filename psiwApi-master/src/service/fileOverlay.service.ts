import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

interface IFileOverlayParams {
  psiwType: string
  psiwVideo: string
  reactVideo: string
}

interface IFileOverlay {
  compiledVideo: string
}

export async function fileOverlay ({ psiwType, psiwVideo, reactVideo }: IFileOverlayParams): Promise<IFileOverlay> {
  const psiwTypePath = path.join(__dirname, '..', '..', 'public', 'psiwTypes', psiwType)
  let psiwVideoPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'viewedFiles', psiwVideo)
  let reactVideoPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'reactedFiles', reactVideo)

  const outputVideoName = `${Date.now()}.mp4`
  const outputVideoPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'compiledFiles', outputVideoName)

  if (psiwVideo.endsWith('.webm')) {
    const psiwVideoMP4Path = psiwVideoPath.replace('webm', 'mp4')

    await convertWebMtoMP4(psiwVideoPath, psiwVideoMP4Path)
    psiwVideoPath = psiwVideoMP4Path
  }

  if (reactVideo.endsWith('.webm')) {
    const reactVideoMP4Path = reactVideoPath.replace('webm', 'mp4')
    await convertWebMtoMP4(reactVideoPath, reactVideoMP4Path)
    reactVideoPath = reactVideoMP4Path
  }

  let isPsiwImage = false
  const psiwVideoExt = path.extname(psiwVideoPath).toLowerCase()
  if (psiwVideoExt === '.jpg' || psiwVideoExt === '.png' || psiwVideoExt === '.jpeg') {
    isPsiwImage = true
  }

  return await new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()

    ffmpegCommand
      .input(psiwTypePath)

    if (isPsiwImage) {
      ffmpegCommand
        .input(psiwVideoPath)
        .inputOptions(['-stream_loop -1', '-t 30'])
    } else {
      ffmpegCommand.input(psiwVideoPath)
    }

    ffmpegCommand
      .input(reactVideoPath)
      .complexFilter([
        {
          filter: 'scale',
          options: '576:1024',
          // inputs: '0:v',
          outputs: 'scaleInput'
        },
        {
          filter: 'scale',
          options: '437:777',
          inputs: '1:v',
          outputs: 'scaleOverlay1'
        },
        {
          filter: 'scale',
          options: '285:508:force_original_aspect_ratio=increase',
          inputs: '2:v',
          outputs: 'cover'
        },
        {
          filter: 'crop',
          options: '285:508',
          inputs: 'cover',
          outputs: 'cropCover'
        },
        {
          filter: 'overlay',
          inputs: ['scaleInput', 'scaleOverlay1'],
          outputs: 'v1',
          options: { x: 0, y: 0 }
        },
        {
          filter: 'overlay',
          inputs: ['v1', 'cropCover'],
          outputs: 'output',
          options: { x: 'W-w-0', y: 'H-h-0' }
        }
      ], 'output')
      .videoCodec('libx264')
      .addOption('-profile:v', 'main')
      .addOption('-preset', 'medium')
      .addOption('-b:v', '2500k')
      .audioCodec('aac')
      .audioFrequency(44100)
      .outputOptions([
        // '-map 0:v',
        '-profile:v baseline', // Use the baseline profile
        '-level 3.0',
        '-map 1:a?',
        '-map 2:a?',
        '-filter_complex',
        '[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[psiwAudio];' +
            '[2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[reactAudio];' +
            '[psiwAudio][reactAudio]amix=inputs=2:duration=longest:dropout_transition=2[audio]',
        '-map [audio]'
      ])
      .audioChannels(2)
      .output(outputVideoPath)
      .on('end', () => {
        console.log('Video overlay complete.')
        resolve({ compiledVideo: outputVideoName })
      })
      .on('error', (err) => {
        console.error('Error:', err)
        reject(err)
      })
      .run()
  })
}

const convertWebMtoMP4 = async (inputPath: string, outputPath: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioFrequency(44100)
      .output(outputPath)
      .on('end', () => {
        console.log(`Conversion from WebM to MP4 complete: ${outputPath}`)
        resolve()
      })
      .on('error', (err) => {
        console.error('Error:', err)
        reject(err)
      })
      .run()
  })
}
