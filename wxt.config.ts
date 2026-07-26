import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: 'Writing Polisher',
    version: '1.0.0',
    description: 'Pure browser-side Chinese spelling correction, completely offline',
    minimum_chrome_version: '116',
    homepage_url: 'https://github.com/gandli/writing-polisher-extension',
    permissions: ['storage', 'activeTab'],
    // Remove redundant <all_urls> from host_permissions — content scripts
    // declared via WXT entrypoints already match http://*/* https://*/*
    // which works correctly for MV3 and avoids the strictest permission warning
    host_permissions: [],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon-16.png',
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png',
      },
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
  },
  modules: ['@wxt-dev/module-react'],
});
