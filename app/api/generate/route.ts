import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the N8N webhook URL from environment variables
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('[API] N8N webhook URL not configured');
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // Get the request body
    const body = await request.json();
    
    console.log(`[API] Proxying request to N8N webhook: ${webhookUrl}`, {
      toolId: body.tool?.id,
      messageLength: body.message?.content?.length,
      hasImage: !!body.image,
    });

    // Forward the request to N8N webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YumMi-WebApp/1.0',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] N8N webhook request failed:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: 'Webhook request failed',
          details: {
            status: response.status,
            message: response.statusText,
          }
        },
        { status: response.status }
      );
    }

    // Get the response data
    const responseData = await response.json();
    
    console.log(`[API] N8N webhook request successful:`, {
      responseSize: JSON.stringify(responseData).length,
    });

    // Return the response data
    return NextResponse.json({
      success: true,
      data: {
        response: responseData.response || responseData.content || 'Response received',
        tokens: responseData.tokens,
      },
    });

  } catch (error: any) {
    console.error(`[API] Webhook proxy error:`, {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
