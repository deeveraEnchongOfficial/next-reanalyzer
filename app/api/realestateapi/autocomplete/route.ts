import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { search } = await request.json();

    if (!search) {
      return NextResponse.json({ message: 'Search term is required' }, { status: 400 });
    }

    const apiKey = process.env.REAL_STATE_API_KEY;
    const apiUrl = process.env.REAL_STATE_BASE_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ message: 'API configuration is missing' }, { status: 500 });
    }

    const response = await fetch(`https://api.realestateapi.com/v2/AutoComplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ 
        search,
        search_types: ["A", "C", "G", "N", "P", "T", "Z"],
       }),
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
