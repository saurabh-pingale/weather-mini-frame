import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const buttonIndex = data.untrustedData?.buttonIndex;
    
    if (!buttonIndex) {
      return new NextResponse(getFrameHtml({ 
        imageUrl: 'https://weather-mini-frame-ten.vercel.app/error-image.png',
        postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
        buttons: [
          { label: 'Try Again', action: 'post' }
        ],
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (buttonIndex === 1) {
      return new NextResponse(getFrameHtml({ 
        imageUrl: 'https://weather-mini-frame-ten.vercel.app/og-image.png',
        postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
        buttons: [
          { label: 'Current Weather', action: 'post' },
          { label: 'Search City', action: 'post' }
        ]
      }), {
        headers: { 'Content-Type': 'text/html' },
      });
    } else if (buttonIndex === 2) {
      return new NextResponse(getFrameHtml({
        imageUrl: 'https://weather-mini-frame-ten.vercel.app/search-image.png',
        postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame/search',
        inputText: 'Enter city name',
        buttons: [{ label: 'Search', action: 'post' }]
      }), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new NextResponse(getFrameHtml({ 
      imageUrl: 'https://weather-mini-frame-ten.vercel.app/error-image.png',
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
      buttons: [
        { label: 'Try Again', action: 'post' }
      ],
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new NextResponse(getFrameHtml({ 
      imageUrl: 'https://weather-mini-frame-ten.vercel.app/error-image.png',
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
      buttons: [
        { label: 'Try Again', action: 'post' }
      ],
      error: 'Server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function getFrameHtml(options: {
  imageUrl: string;
  postUrl: string;
  buttons?: Array<{ label: string; action?: string }>;
  inputText?: string;
  error?: string;
}) {
  const buttonsHtml = options.buttons?.map((button, i) => 
    `<meta property="fc:frame:button:${i + 1}" content="${button.label}" />
     <meta property="fc:frame:button:${i + 1}:action" content="${button.action || 'post'}" />`
  ).join('') || '';

  const inputHtml = options.inputText ? 
    `<meta property="fc:frame:input:text" content="${options.inputText}" />` : '';

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${options.imageUrl}" />
        <meta property="fc:frame:post_url" content="${options.postUrl}" />
        ${inputHtml}
        ${buttonsHtml}
        <meta property="og:image" content="${options.imageUrl}" />
        ${options.error ? `<meta property="og:description" content="${options.error}" />` : ''}
      </head>
    </html>`;
}