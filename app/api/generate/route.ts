import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  // Get webhook URL from environment variables
  const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? process.env.WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    console.error('[API] N8N webhook URL not configured');
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
  }

  // Parse request payload
  let payload: unknown = {};
  try { 
    payload = await req.json(); 
  } catch (e) {
    console.warn('[API] Failed to parse JSON payload, using empty object');
  }

  // Log request details
  const body = payload as any;
  console.log(`[API] Proxying request to N8N webhook: ${WEBHOOK_URL}`, {
    toolId: body.tool?.id,
    messageLength: body.message?.content?.length,
    hasImage: !!body.image,
  });

  try {
    // Create AbortController for timeout (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
    
    console.log(`[API] N8N webhook response:`, {
      status: n8nRes.status,
      processingTime,
      responseSize: text.length,
    });

    // Return response with same status and content-type as N8N
    return new NextResponse(text, {
      status: n8nRes.status,
      headers: { 'content-type': n8nRes.headers.get('content-type') || 'application/json' },
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
