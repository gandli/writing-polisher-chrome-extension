/**
 * Local storage wrapper using chrome.storage.local
 */

import { StorageData, defaultStorageData } from '../types';

const STORAGE_KEY = 'writing-polisher-data';

export async function getStorageData(): Promise<StorageData> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        resolve({
          ...defaultStorageData,
          ...result[STORAGE_KEY],
        });
      } else {
        resolve(defaultStorageData);
      }
    });
  });
}

export async function setStorageData(data: Partial<StorageData>): Promise<void> {
  const current = await getStorageData();
  const updated = {
    ...current,
    ...data,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updated }, resolve);
  });
}

export async function getCustomDictionary(): Promise<Record<string, string>> {
  const data = await getStorageData();
  return data.customDictionary;
}

export async function setCustomDictionary(dict: Record<string, string>): Promise<void> {
  await setStorageData({ customDictionary: dict });
}

export async function getCustomLaws(): Promise<Record<string, Record<string, string>>> {
  const data = await getStorageData();
  return data.customLaws;
}

export async function setCustomLaws(laws: Record<string, Record<string, string>>): Promise<void> {
  await setStorageData({ customLaws: laws });
}

export async function getEnabled(): Promise<boolean> {
  const data = await getStorageData();
  return data.enabled;
}

export async function setEnabled(enabled: boolean): Promise<void> {
  await setStorageData({ enabled });
}

export async function getGrammarEnabled(): Promise<boolean> {
  const data = await getStorageData();
  return data.grammarEnabled;
}

export async function setGrammarEnabled(enabled: boolean): Promise<void> {
  await setStorageData({ grammarEnabled: enabled });
}

export async function getGrammarServerUrl(): Promise<string> {
  const data = await getStorageData();
  return data.grammarServerUrl;
}

export async function setGrammarServerUrl(url: string): Promise<void> {
  await setStorageData({ grammarServerUrl: url });
}

export async function getGrammarLanguage(): Promise<string> {
  const data = await getStorageData();
  return data.grammarLanguage;
}

export async function setGrammarLanguage(lang: string): Promise<void> {
  await setStorageData({ grammarLanguage: lang });
}
