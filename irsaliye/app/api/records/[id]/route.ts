
import { getReceiptById, updateReceipt, deleteReceipt } from '@/lib/database';
import { createErrorResponse, validateRequiredFields } from '@/lib/errorHandler';

type NextRequest = Request;

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse('Geçersiz ID', 400, 'INVALID_ID');
    }
    
    const updates = await request.json();
    const updatedRecord = await updateReceipt(id, updates);
    
    if (!updatedRecord) {
      return createErrorResponse('Kayıt bulunamadı', 404, 'RECORD_NOT_FOUND');
    }
    
    return new Response(JSON.stringify(updatedRecord), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update error:', error);
    return createErrorResponse('Kayıt güncellenirken bir hata oluştu', 500, 'UPDATE_ERROR');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse('Geçersiz ID', 400, 'INVALID_ID');
    }
    
    const deleted = await deleteReceipt(id);
    
    if (!deleted) {
      return createErrorResponse('Kayıt bulunamadı', 404, 'RECORD_NOT_FOUND');
    }
    
    return new Response(JSON.stringify({ message: 'Kayıt silindi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return createErrorResponse('Kayıt silinirken bir hata oluştu', 500, 'DELETE_ERROR');
  }
}