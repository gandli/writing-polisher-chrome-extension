import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: 'Writing Polisher',
    version: '1.0.0',
    description: 'Pure browser-side Chinese spelling correction, completely offline',
    minimum_chrome_version: '116',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    action: {
      default_popup: 'popup.html',
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
  },
  modules: ['@wxt-dev/module-react'],
});
