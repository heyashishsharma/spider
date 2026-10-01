import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.json({ error: searchParams.get('error_description') || error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
  }

  try {
    // Step 1: Exchange code for short-lived token
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    const shortLivedToken = tokenData.access_token;

    // Step 2: Exchange short-lived token for long-lived token (60 days)
    const longTokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`);
    const longTokenData = await longTokenResponse.json();

    if (longTokenData.error) {
      throw new Error(longTokenData.error.message);
    }

    const longLivedToken = longTokenData.access_token;

    // TODO: In Phase 3, we will store `longLivedToken` securely in Firebase Firestore 
    // against the user's ID. Since Firebase Auth is skipped for now, we just return it to the dashboard.

    // For now, redirect to the dashboard with the token (in production, use a secure cookie or session)
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('token_status', 'success');
    
    return NextResponse.redirect(dashboardUrl);
    
  } catch (err: any) {
    console.error('Meta OAuth Error:', err);
    return NextResponse.json({ error: 'Failed to authenticate with Meta', details: err.message }, { status: 500 });
  }
}
