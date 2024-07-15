import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../src/actions'; // Adjust the path according to your project structure

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('Received body:', req.body); // Log the received body

    const result = await createClient({}, req.body);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};



