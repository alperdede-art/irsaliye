
import { getAllReceipts } from '@/lib/database';
import { createErrorResponse } from '@/lib/errorHandler';

type NextRequest = Request;

export async function GET() {
  try {
    const records = await getAllReceipts();
    
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Fetch records error:', error);
    return createErrorResponse('Kayıtlar alınırken bir hata oluştu', 500, 'FETCH_RECORDS_ERROR');
  }
}