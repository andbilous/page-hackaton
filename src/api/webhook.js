export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  try {
    const response = await fetch('https://api.winning-koala-57696.appmixer.cloud/flows/0434db50-90f6-4c90-98de-1a5e0b0a9d20/components/d686d7d9-8749-4f19-9ec1-57612692b215', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy to Appmixer failed' });
  }
}
