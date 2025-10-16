# Vercel Error Codes Guide

This guide explains common Vercel error codes and how to address them in your application.

## Application Errors

### BODY_NOT_A_STRING_FROM_FUNCTION (502)
**Cause:** Function response body is not a string.
**Solution:** Ensure your API routes return stringified JSON:
```javascript
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});
```

### DEPLOYMENT_BLOCKED (403)
**Cause:** Deployment was blocked due to project settings or account limitations.
**Solution:** Check your Vercel dashboard for project settings and billing status.

### DEPLOYMENT_DELETED (410)
**Cause:** The deployment has been deleted.
**Solution:** Redeploy your application.

### DEPLOYMENT_DISABLED (402)
**Cause:** Deployment is disabled, possibly due to billing issues.
**Solution:** Check your Vercel billing settings.

### DEPLOYMENT_NOT_FOUND (404)
**Cause:** The requested deployment doesn't exist.
**Solution:** Verify the deployment URL and redeploy if necessary.

### FUNCTION_INVOCATION_FAILED (500)
**Cause:** Your serverless function encountered an unhandled error.
**Solution:** Add proper error handling to your API routes:
```javascript
export async function POST(request: NextRequest) {
  try {
    // Your function logic
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### FUNCTION_INVOCATION_TIMEOUT (504)
**Cause:** Function exceeded execution timeout (default 10 seconds).
**Solution:** Optimize your function or increase timeout:
```javascript
// In your API route, optimize heavy operations
export const config = {
  maxDuration: 60, // Increase timeout to 60 seconds (requires Pro plan)
};
```

### FUNCTION_PAYLOAD_TOO_LARGE (413)
**Cause:** Request payload exceeds size limits.
**Solution:** Implement file size validation:
```javascript
if (file.size > 10 * 1024 * 1024) {
  return new Response(JSON.stringify({ error: 'File too large' }), {
    status: 413,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### REQUEST_HEADER_TOO_LARGE (431)
**Cause:** Request headers exceed size limits.
**Solution:** Minimize header sizes in your requests.

### RESOURCE_NOT_FOUND (404)
**Cause:** Requested resource doesn't exist.
**Solution:** Implement proper routing and validation:
```javascript
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // ... rest of your logic
}
```

## Platform Errors

These errors are typically related to Vercel's infrastructure:

### INTERNAL_FUNCTION_INVOCATION_FAILED (500)
**Cause:** Internal Vercel error during function execution.
**Solution:** Retry the request. If persists, contact Vercel support.

### INTERNAL_DEPLOYMENT_FETCH_FAILED (500)
**Cause:** Internal Vercel error fetching deployment.
**Solution:** Retry deployment. If persists, contact Vercel support.

## Best Practices for Error Handling

### 1. Proper Error Responses
Always return structured error responses:
```typescript
// In your API routes
return new Response(
  JSON.stringify({ 
    error: 'Descriptive error message',
    code: 'ERROR_CODE' 
  }), 
  {
    status: 400, // Appropriate HTTP status code
    headers: { 'Content-Type': 'application/json' }
  }
);
```

### 2. Logging
Add comprehensive logging to debug issues:
```typescript
try {
  // Your logic
} catch (error) {
  console.error('Operation failed:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  return new Response(
    JSON.stringify({ error: 'Operation failed' }),
    { status: 500 }
  );
}
```

### 3. Validation
Validate inputs early to prevent downstream errors:
```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.requiredField) {
      return new Response(
        JSON.stringify({ error: 'Missing required field' }),
        { status: 400 }
      );
    }
    
    // Continue with processing...
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON payload' }),
      { status: 400 }
    );
  }
}
```

### 4. Timeout Management
For long-running operations, implement proper timeout handling:
```typescript
export const config = {
  maxDuration: 30, // 30 seconds
};

// Or implement cancellation logic for very long operations
```

### 5. Resource Limits
Be aware of Vercel's limits:
- Serverless Function Execution Timeout: 10s (free), 60s (pro), 900s (enterprise)
- Serverless Function Payload Size: 4.5 MB (request), 22.5 MB (response)
- Serverless Function Memory: 1024 MB

## Monitoring and Debugging

1. Use Vercel's built-in logs:
   ```bash
   vercel logs your-deployment-url
   ```

2. Implement structured logging in your application:
   ```typescript
   console.log(JSON.stringify({
     event: 'receipt_processed',
     receiptId: receipt.id,
     duration: Date.now() - startTime,
     success: true
   }));
   ```

3. Use monitoring tools like Sentry or LogRocket for production applications.

## Common Issues in Your Application

Based on your code review, here are specific recommendations:

1. **Database Connection Issues:**
   ```typescript
   // In lib/database.ts, add connection pooling and better error handling
   try {
     await client.connect();
   } catch (error) {
     console.error('Database connection failed:', error);
     // Fallback to in-memory storage
     hasDatabase = false;
   }
   ```

2. **OCR Processing Timeouts:**
   ```typescript
   // In lib/ocr.ts, add timeout handling
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
   
   try {
     const poller = await client.beginAnalyzeDocument("prebuilt-invoice", buffer, {
       abortSignal: controller.signal
     });
     // ... rest of processing
   } finally {
     clearTimeout(timeoutId);
   }
   ```

3. **File Upload Validation:**
   Your current implementation is good, but consider adding file type validation:
   ```typescript
   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
   if (!allowedTypes.includes(file.type)) {
     return new Response(
       JSON.stringify({ error: 'Unsupported file type' }),
       { status: 400 }
     );
   }
   ```

By implementing these practices, you can minimize Vercel error occurrences and improve your application's reliability.