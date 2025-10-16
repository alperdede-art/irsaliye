// Utility functions for consistent error handling across the application

/**
 * Creates a standardized API response for errors
 */
export function createErrorResponse(message: string, status: number = 500, code?: string) {
  const errorResponse = {
    error: message,
    ...(code && { code })
  };
  
  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handles common API route errors
 */
export function handleApiError(error: any, context: string = ''): Response {
  console.error(`API Error ${context}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'SyntaxError' && error instanceof SyntaxError) {
    return createErrorResponse('Invalid JSON payload', 400, 'INVALID_JSON');
  }
  
  if (error.name === 'ValidationError') {
    return createErrorResponse(error.message, 400, 'VALIDATION_ERROR');
  }
  
  // Handle database errors
  if (error.message && error.message.includes('database')) {
    return createErrorResponse('Database operation failed', 500, 'DATABASE_ERROR');
  }
  
  // Handle OCR/service errors
  if (error.message && error.message.includes('timeout')) {
    return createErrorResponse('Service timeout', 504, 'SERVICE_TIMEOUT');
  }
  
  // Generic server error
  return createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR');
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields(data: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

/**
 * Validates file uploads
 */
export function validateFileUpload(file: File, maxSizeMB: number = 10): string | null {
  // Check if file exists
  if (!file) {
    return 'No file provided';
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size exceeds ${maxSizeMB}MB limit`;
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.';
  }
  
  return null;
}

/**
 * Wraps API route handlers with consistent error handling
 */
export function withErrorHandling(handler: Function) {
  return async function(...args: any[]) {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}