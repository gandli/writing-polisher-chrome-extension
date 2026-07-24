import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: 'Writing Polisher',
    version: '1.0.0',
    description: '口语化表达转专业书面法律文书，支持离线词典转换和法条查询',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
    action: {
      default_popup: 'popup.html',
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content.ts'],
      },
    ],
  },
  modules: ['@wxt-dev/module-react'],
});
