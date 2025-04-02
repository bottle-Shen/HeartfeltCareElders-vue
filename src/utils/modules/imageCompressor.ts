import Compressor from 'compressorjs';

// 压缩图片

export const compressImage = (file: File, options: Compressor.Options = {}) => {
  return new Promise((resolve, reject) => {
    // 校正 resize 参数
    const correctedOptions = {
      ...options,
      resize: convertResizeOption(options.resize),
    };

    new Compressor(file, {
      ...correctedOptions,
      success(result: File) {
        resolve(result);
      },
      error(err: Error) {
        console.error('图片压缩失败:', err);
        reject(err);
      },
    });
  });
};
// 将 resize 参数转换为合法值
const convertResizeOption = (resize: boolean | "contain" | "cover" | "none" | undefined): "contain" | "cover" | "none" | undefined => {
  if (resize === true) {
    return "contain"; // 默认使用 "contain"
  } else if (resize === false) {
    return "none"; // 禁用缩放
  }
  return resize; // 其他合法值直接返回
};


//  压缩封面图和多张图片

export const compressImages = async (coverImage: File, images: File[], options: Compressor.Options = {}): Promise<{ coverImage: File, images: File[] }> => {
  try {
    // 压缩封面图-单张图片
    const compressedCoverImage = await compressImage(coverImage, options) as File;

    // 压缩多张图片
    const compressedImages = await Promise.all(
      images.map((img) => compressImage(img, options)) as Promise<File>[]
    );

    return { coverImage: compressedCoverImage, images: compressedImages };
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw error;
  }
};