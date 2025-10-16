type NextRequest = Request;
import { saveReceipt } from '@/lib/database';
import { createErrorResponse, validateRequiredFields } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    const receiptData = await request.json();
    
    // Validate required fields
    const validationError = validateRequiredFields(receiptData, [
      'invoiceNumber', 'date', 'productName', 'quantity', 'unit', 'confidence'
    ]);
    
    if (validationError) {
      return createErrorResponse(validationError, 400, 'VALIDATION_ERROR');
    }
    
    // Save to database
    const savedRecord = await saveReceipt(receiptData);
    
    return new Response(JSON.stringify(savedRecord), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Save error:', error);
    return createErrorResponse('İrsaliye kaydedilirken bir hata oluştu', 500, 'SAVE_ERROR');
  }
}