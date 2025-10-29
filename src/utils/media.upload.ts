import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
});

export const uploadToImageKit = async (buffer: Buffer, fileName: string) => {
  const response = await imagekit.files.upload({
    file: buffer.toString("base64"),
    fileName,
  });
  return response;
};
