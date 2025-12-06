import { BadRequestException } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { rm } from 'fs/promises';
import { FileUpload } from 'graphql-upload-ts';
import { join } from 'path';
import { finished } from 'stream/promises';

export const saveImage = async (file: FileUpload) => {
  // 1- validation for memetype
  if (!file.mimetype.startsWith('images/')) {
    throw new BadRequestException('Upsupported file');
  }

  //2- declaring fileName and path
  const filename = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}-${file.filename}`;
  const path = join(process.cwd(), 'images', filename);

  //3- create the write and read stream
  const readStream = file.createReadStream();
  const writeStream = createWriteStream(path);

  //4- sync the write and read stream
  readStream.pipe(writeStream);
  try {
    await finished(writeStream);
    return filename;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload file');
  }
};

export const deleteImage = async (fileName: string) => {
  const path = join(process.cwd(), 'images', fileName);

  try {
    await rm(path, { force: true });
    return true;
  } catch (error) {
    console.error(`Failed to delete image: ${fileName}`, error);
    throw new Error('Failed to delete image');
  }
};
