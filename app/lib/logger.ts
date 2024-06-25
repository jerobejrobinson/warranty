// utils/logger.ts
import { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const logQueryTime = async (req: NextApiRequest, res: NextApiResponse, handler: Handler) => {
  const start = process.hrtime();

  await handler(req, res);

  const [seconds, nanoseconds] = process.hrtime(start);
  const milliseconds = (seconds * 1000 + nanoseconds / 1e6).toFixed(3);

  console.log(`Query took ${milliseconds} ms`);
};