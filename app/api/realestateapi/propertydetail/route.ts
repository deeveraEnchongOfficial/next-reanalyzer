import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.REAL_STATE_API_KEY;
    const apiUrl = process.env.REAL_STATE_BASE_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ message: 'API configuration is missing' }, { status: 500 });
    }

    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'Missing required fields: id' }, { status: 400 });
    }

    const payload = {id
    };

    const response = await fetch(`${apiUrl}/v2/PropertyDetail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({id}),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ message: `Failed to fetch data: ${errorMessage}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
