#pragma once

#include <workerd/jsg/jsg.h>
#include <workerd/jsg/modules-new.h>
#include <workerd/jsg/url.h>

namespace workerd::api {

class Base64Module final: public jsg::Object {
 public:
  Base64Module() = default;
  Base64Module(jsg::Lock&, const jsg::Url&) {}

  kj::Maybe<kj::Array<kj::byte>> decodeBase64ArrayBuffer(kj::Array<kj::byte>);
  kj::Array<kj::byte> encodeBase64ArrayBuffer(kj::Array<kj::byte>);
  kj::String encodeBase64ArrayBufferToString(kj::Array<kj::byte>);

  JSG_RESOURCE_TYPE(Base64Module) {
    JSG_METHOD(encodeBase64ArrayBuffer);
    JSG_METHOD(decodeBase64ArrayBuffer);
    JSG_METHOD(encodeBase64ArrayBufferToString);
  }
};

template <class Registry>
void registerBase64Module(Registry& registry, auto featureFlags) {
  registry.template addBuiltinModule<Base64Module>(
      "cloudflare-internal:base64", workerd::jsg::ModuleRegistry::Type::INTERNAL);
}

template <typename TypeWrapper>
kj::Own<jsg::modules::ModuleBundle> getInternalBase64ModuleBundle(auto featureFlags) {
  jsg::modules::ModuleBundle::BuiltinBuilder builder(
      jsg::modules::ModuleBundle::BuiltinBuilder::Type::BUILTIN_ONLY);
  static const auto kSpecifier = "cloudflare-internal:base64"_url;
  builder.addObject<Base64Module, TypeWrapper>(kSpecifier);
  return builder.finish();
}

#define EW_BASE64_ISOLATE_TYPES api::Base64Module

}  // namespace workerd::api
