import { getMonths } from '@/src/app/lib/mongodb/months';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { months, error } = await getMonths();
      if (error) throw new Error(error);

      return res.status(200).json({ months });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
