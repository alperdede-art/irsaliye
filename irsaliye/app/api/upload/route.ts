
import { extractReceiptData } from '@/lib/ocr';
import { createErrorResponse, validateFileUpload } from '@/lib/errorHandler';

type NextRequest = Request;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validate file upload
    const validationError = validateFileUpload(file, 10); // 10MB limit
    if (validationError) {
      return createErrorResponse(validationError, 400, 'FILE_VALIDATION_ERROR');
    }
    
    // Process the image with OCR
    const receiptData = await extractReceiptData(file);
    
    return new Response(JSON.stringify(receiptData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    return createErrorResponse('İrsaliye işlenirken bir hata oluştu', 500, 'OCR_PROCESSING_ERROR');
  }
}