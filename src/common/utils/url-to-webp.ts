import convertWebp from './convert-webp';

const urlToWebp = async (url: string) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const file = new File([buffer], 'image.webp', { type: 'image/webp' });
  const webpFile = await convertWebp(file);
  return webpFile;
};

export default urlToWebp;
