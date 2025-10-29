import { imagekit } from "./imagekit.ts";

export const uploadToImageKit = async (
  buffer: Buffer,
  fileName: string,
  folderName: string
) => {
  const base64File = buffer.toString("base64");

  const response = await imagekit.files.upload({
    file: base64File,
    fileName,
    folder: process.env.IMAGEKIT_FOLDER || folderName,
    useUniqueFileName: true,
  });

  return response;
};
export const buildThumbnailUrl = (fileUrl: string): string => {
  return `${fileUrl}?tr=so-1000,fo-auto,f-jpg`;
};
