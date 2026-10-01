import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateInstagramPost } from '@/lib/gemini';
import { publishInstagramPost } from '@/lib/instagram';

export async function GET(request: NextRequest) {
  // 1. Security Check: Ensure this was triggered by our GitHub Action
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron Job Triggered: Starting auto-publishing sequence...');

    // 2. Fetch User Settings (In Phase 4, we will fetch this from Firebase Firestore)
    // For now, we mock the data that the user saved in the Media Kit UI
    const niche = 'Coding & Tech Tips'; 
    const tone = 'Professional & Educational';
    const instructions = 'Keep captions under 4 sentences. Always use emojis.';
    
    // The Instagram account ID and access token (Fetched from DB in production)
    const igUserId = process.env.TEST_IG_USER_ID || ''; 
    const accessToken = process.env.TEST_USER_ACCESS_TOKEN || '';

    if (!igUserId || !accessToken) {
       console.warn('Missing Instagram ID or Access Token. Skipping publish.');
       return NextResponse.json({ status: 'skipped', reason: 'Missing credentials' }, { status: 200 });
    }

    // 3. Generate the Post Content via Gemini
    const caption = await generateInstagramPost(niche, tone, instructions);
    console.log(`Generated Caption: ${caption}`);

    // 4. Generate an Image (In a full app, you'd integrate an image generator API here)
    // For now, we use a placeholder tech image
    const imageUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1080&q=80';

    // 5. Publish to Instagram
    const postId = await publishInstagramPost(igUserId, accessToken, imageUrl, caption);
    
    console.log(`Successfully published post to Instagram. Post ID: ${postId}`);

    return NextResponse.json({ status: 'success', postId, caption }, { status: 200 });
  } catch (error: any) {
    console.error('Auto-Publishing Error:', error);
    return NextResponse.json({ error: 'Failed to publish post', details: error.message }, { status: 500 });
  }
}
