export function createOAuthHeader(consumerKey: string, token: string) {
  return `OAuth oauth_consumer_key="${consumerKey}", oauth_token="${token}"`;
}
