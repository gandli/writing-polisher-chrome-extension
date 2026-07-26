import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: 'Writing Polisher',
    version: '1.0.0',
    description: 'Pure browser-side Chinese spelling correction, completely offline',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
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
