import { NextResponse } from 'next/server';

const BASE_URL = `${process.env.PROJECT_API}/api`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const res = await fetch(`${BASE_URL}/months/user/${userId}`, {
    headers: {
      /* Authorization: `Bearer ${localStorage.getItem('authToken')}`, */
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYyM2IxMDk5ZmI1OTUxM2NhZjQ1YzAiLCJlbWFpbCI6InZpdHRva21AZ21haWwuY29tIiwibmFtZSI6IlZpdG9yIiwiaWF0IjoxNjg0NTk0OTA5LCJleHAiOjE2ODQ2MTY1MDl9.r8_5j-jpRwtuNk075vGn92IYQFl191KEMzHXjpoPykY`,
    },
  });
  const data = await res.json();
  return NextResponse.json({ data });
}
