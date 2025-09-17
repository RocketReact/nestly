export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '@/app/api/api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '@/app/api/_utils/utils';
import { isAxiosError } from 'axios';


export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const avatar = await request.formData();

    const res = await api.patch('/users/current/avatars', avatar, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
