import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
  ?? process.env.WEBHOOK_URL
  ?? 'https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  if (!WEBHOOK_URL) {
    console.error('[API] N8N webhook URL not configured');
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') || '';
  
  try {
    // Create AbortController for timeout (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Handle multipart/form-data (file uploads)
    if (contentType.startsWith('multipart/form-data')) {
      console.log(`[API] Proxying multipart request to N8N webhook: ${WEBHOOK_URL}`);
      
      // Read FormData from request
      const formData = await req.formData();
      
      // Create new FormData to proxy to N8N
      const proxyFormData = new FormData();
      for (const [key, value] of formData.entries()) {
        proxyFormData.append(key, value as File | string);
      }

      // Log file details if present
      const file = formData.get('file') as File;
      if (file) {
        console.log(`[API] File upload:`, {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        });
      }

      const n8nRes = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: proxyFormData, // FormData sets correct Content-Type with boundary
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const processingTime = Date.now() - startTime;
      
      // Get response as buffer to handle both JSON and binary responses
      const buffer = await n8nRes.arrayBuffer();
      
      console.log(`[API] N8N multipart response:`, {
        status: n8nRes.status,
        processingTime,
        responseSize: buffer.byteLength,
      });

      return new NextResponse(buffer, {
        status: n8nRes.status,
        headers: { 
          'content-type': n8nRes.headers.get('content-type') || 'application/json' 
        },
      });
    }

    // Handle JSON requests (default)
    console.log(`[API] Proxying JSON request to N8N webhook: ${WEBHOOK_URL}`);
    
    let payload: unknown = {};
    try { 
      payload = await req.json(); 
    } catch (e) {
      console.warn('[API] Failed to parse JSON payload, using empty object');
    }

    // Log request details
    const body = payload as any;
    console.log(`[API] Request details:`, {
      toolId: body.tool?.id,
      messageLength: body.message?.content?.length,
      hasImage: !!body.image,
    });

    const n8nRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const processingTime = Date.now() - startTime;
    
    // Get response text (handles both JSON and plain text)
    const text = await n8nRes.text();
    
    console.log(`[API] N8N JSON response:`, {
      status: n8nRes.status,
      processingTime,
      responseSize: text.length,
    });

    return new NextResponse(text, {
      status: n8nRes.status,
      headers: { 
        'content-type': n8nRes.headers.get('content-type') || 'application/json' 
      },
    });

  } catch (e: any) {
    const processingTime = Date.now() - startTime;
    
    console.error('[API] Upstream n8n call failed:', {
      error: e.name,
      message: e.message,
      processingTime,
    });

    if (e.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    
    return NextResponse.json({ error: 'Upstream n8n call failed' }, { status: 502 });
  }
}
