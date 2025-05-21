declare module "cloudflare:base64" {
  function _encodeBase64ArrayBuffer(input: ArrayBufferLike): ArrayBuffer;
  function _encodeBase64ArrayBufferToString(input: ArrayBufferLike): string ;
  function _decodeBase64ArrayBuffer(input: ArrayBufferLike): ArrayBuffer | null;
  export {
    _encodeBase64ArrayBuffer as encodeBase64ArrayBuffer,
    _encodeBase64ArrayBufferToString as encodeBase64ArrayBufferToString,
    _decodeBase64ArrayBuffer as decodeBase64ArrayBuffer
  };
}
