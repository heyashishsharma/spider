import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCommentReply } from '@/lib/gemini';
import { replyToInstagramComment } from '@/lib/instagram';

// Webhook Verification (Meta sends a GET request to verify the URL)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// Webhook Payload Handling (Meta sends a POST request when an event occurs, like a new comment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's an Instagram webhook event
    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          
          // We only care about new comments
          if (change.field === 'comments') {
            const commentData = change.value;
            
            // Ignore if the comment was made by our own account (prevent infinite loops)
            // Note: In production, you'd compare commentData.from.id to your authenticated user's ID
            if (commentData.from.id === entry.id) {
              continue;
            }

            console.log(`New comment received from ${commentData.from.username}: ${commentData.text}`);

            // 1. Ask Gemini to generate a context-aware reply
            const tone = 'professional'; // TODO: fetch this from user's Media Kit config in DB
            const replyText = await generateCommentReply(commentData.text, tone);
            
            console.log(`AI generated reply: ${replyText}`);

            // 2. Post the reply back to Instagram
            const userAccessToken = process.env.TEST_USER_ACCESS_TOKEN || ''; // TODO: fetch long-lived token from DB
            
            if (userAccessToken) {
               await replyToInstagramComment(commentData.id, replyText, userAccessToken);
               console.log('Successfully replied to Instagram comment.');
            } else {
               console.warn('Missing access token, cannot reply to comment.');
            }
          }
        }
      }
      return NextResponse.json({ status: 'success' }, { status: 200 });
    }
    
    return NextResponse.json({ status: 'ignored' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
