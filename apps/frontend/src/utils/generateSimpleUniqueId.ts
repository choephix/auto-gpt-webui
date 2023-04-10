export function generateSimpleUniqueId() {
  const timestamp = new Date().getTime().toString(36);
  const randomNum = Math.floor(Math.random()).toString(36);
  return `${timestamp}-${randomNum}`;
}
