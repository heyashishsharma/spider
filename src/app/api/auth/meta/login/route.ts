import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;
  
  if (!appId || !redirectUri) {
    return NextResponse.json({ error: 'Missing Meta App ID or Redirect URI in environment variables' }, { status: 500 });
  }

  // Define the required scopes for Instagram automation
  const scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement'
  ].join(',');

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
