// app/api/google-proxy/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Get parameters from the frontend request (e.g., a search query)
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  // 2. Use your SECRET key (No NEXT_PUBLIC_ prefix)
  const apiKey = process.env.GOOGLE_MAPS_SECRET_KEY;

  // 3. Call Google's API from the server
  const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  try {
    const response = await fetch(googleUrl);
    const data = await response.json();

    // 4. Return the data back to your frontend
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}