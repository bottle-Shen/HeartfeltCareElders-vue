import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// const ffmpeg = createFFmpeg({ log: true });
const ffmpeg = createFFmpeg({ log: false });


export const compressVideo = async (file: File) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
  await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', 'output.mp4');
  const data = ffmpeg.FS('readFile', 'output.mp4');
  return new File([data.buffer], 'output.mp4', { type: 'video/mp4' });
};