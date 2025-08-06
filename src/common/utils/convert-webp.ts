import * as sharp from 'sharp';

const convertWebp = async (image: File) => {
  const arrayBuffer = await image.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);
  const imageBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
  return new File([new Uint8Array(imageBuffer)], 'image.webp', { type: 'image/webp' });
};

export default convertWebp;
