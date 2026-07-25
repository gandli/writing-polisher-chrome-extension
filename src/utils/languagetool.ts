/**
 * LanguageTool 语法拼写检查封装
 * 支持用户配置自定义 LanguageTool 服务器地址，完全离线运行
 */

export interface GrammarMatch {
  offset: number;
  length: number;
  message: string;
  replacements: string[];
  rule: {
    id: string;
    description: string;
  };
}

export interface LanguageToolCheckResult {
  matches: GrammarMatch[];
  language: {
    name: string;
    code: string;
  };
}

export class LanguageToolClient {
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:8081') {
    // 确保 URL 结尾没有斜杠
    this.serverUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  }

  /**
   * 检查文本语法拼写
   * @param text 要检查的文本
   * @param language 语言代码，如 zh-CN, en-US
   */
  async check(text: string, language: string = 'zh-CN'): Promise<GrammarMatch[]> {
    if (!this.serverUrl) {
      return [];
    }

    try {
      const url = `${this.serverUrl}/v2/check`;
      const formData = new URLSearchParams();
      formData.append('text', text);
      formData.append('language', language);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        console.error('LanguageTool check failed:', response.statusText);
        return [];
      }

      const data = await response.json() as LanguageToolCheckResult;
      return data.matches || [];
    } catch (error) {
      console.error('LanguageTool check error:', error);
      return [];
    }
  }

  /**
   * 测试服务器是否可用
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/v2/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'text=test&language=en-US',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getServerUrl(): string {
    return this.serverUrl;
  }

  setServerUrl(url: string): void {
    this.serverUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }
}
