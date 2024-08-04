import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs'; // Note the use of tfjs-node for server-side

const upload = multer({
  storage: multer.diskStorage({
    destination: '/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const uploadMiddleware = upload.single('file');

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req, {}, async (err) => {
      if (err) {
        return reject(new Response('File upload error', { status: 500 }));
      }


      const model = await tf.loadGraphModel('file://coding/cat-or-car/model.h5');
      const image = await fs.readFile(req.file.path);
      const tensor = tf.node.decodeImage(image, 3).resizeBilinear([224, 224]).expandDims(0).toFloat().div(127.5).sub(1);
      const prediction = model.predict(tensor);
      const probabilities = prediction.arraySync()[0];

      resolve(
        NextResponse.json({ cat: probabilities[0], dog: probabilities[1] })
      );
    });
  });
}
