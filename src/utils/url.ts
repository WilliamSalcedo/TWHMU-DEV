export function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
