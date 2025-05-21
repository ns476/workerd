#include "base64.h"

#include <kj/debug.h>

namespace workerd::api {

kj::Maybe<kj::Array<kj::byte>> Base64Module::decodeBase64ArrayBuffer(kj::Array<kj::byte> input) {
  auto size = simdutf::maximal_binary_length_from_base64((const char*)input.begin(), input.size());
  auto buf = kj::heapArray<kj::byte>(size);
  auto result = simdutf::base64_to_binary(
      input.asChars().begin(), input.size(), buf.asChars().begin(), simdutf::base64_default);
  if (result.error != simdutf::SUCCESS) return kj::none;
  KJ_ASSERT(result.count <= size);
  return buf.slice(0, result.count).attach(kj::mv(buf));
}

kj::Array<kj::byte> Base64Module::encodeBase64ArrayBuffer(kj::Array<kj::byte> input) {
  auto size = simdutf::base64_length_from_binary(input.size());
  auto buf = kj::heapArray<kj::byte>(size);
  auto out_size = simdutf::binary_to_base64(
      input.asChars().begin(), input.size(), buf.asChars().begin(), simdutf::base64_default);
  KJ_ASSERT(out_size <= size);
  return buf.slice(0, out_size).attach(kj::mv(buf));
}

kj::String Base64Module::encodeBase64ArrayBufferToString(kj::Array<kj::byte> input) {
  auto size = simdutf::base64_length_from_binary(input.size()) + 1;
  auto buf = kj::heapArray<kj::byte>(size);
  auto out_size = simdutf::binary_to_base64(
      input.asChars().begin(), input.size(), buf.asChars().begin(), simdutf::base64_default);
  KJ_ASSERT(out_size + 1 <= size);
  buf[out_size] = 0;

  // As we've base64 encoded, `buf` is guaranteed to contain valid UTF-8
  return kj::String(buf.releaseAsChars());
}

}  // namespace workerd::api
