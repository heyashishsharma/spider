/**
 * Helper file to manage Instagram Graph API interactions.
 */

// Publish a single image post to an Instagram Professional Account
export async function publishInstagramPost(
  igUserId: string, 
  accessToken: string, 
  imageUrl: string, 
  caption: string
) {
  try {
    // Step 1: Create the IG Container
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const containerData = await containerRes.json();
    
    if (containerData.error) {
      throw new Error(`Failed to create container: ${containerData.error.message}`);
    }

    const creationId = containerData.id;

    // Wait a few seconds for Meta's servers to process the image container
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 2: Publish the Container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const publishData = await publishRes.json();

    if (publishData.error) {
      throw new Error(`Failed to publish container: ${publishData.error.message}`);
    }

    return publishData.id; // The finalized Instagram Post ID
  } catch (error) {
    console.error('Instagram Publishing Error:', error);
    throw error;
  }
}

// Reply to a specific comment on an Instagram Post
export async function replyToInstagramComment(
  commentId: string, 
  message: string, 
  accessToken: string
) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${commentId}/replies?message=${encodeURIComponent(message)}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    const data = await res.json();
    
    if (data.error) {
      throw new Error(`Failed to reply: ${data.error.message}`);
    }
    
    return data.id;
  } catch (error) {
    console.error('Instagram Comment Reply Error:', error);
    throw error;
  }
}
