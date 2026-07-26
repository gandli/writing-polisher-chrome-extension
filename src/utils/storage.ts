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

export async function getEnabled(): Promise<boolean> {
  const data = await getStorageData();
  return data.enabled;
}

export async function setEnabled(enabled: boolean): Promise<void> {
  await setStorageData({ enabled });
}

export async function getModelUrl(): Promise<string> {
  const data = await getStorageData();
  return data.modelUrl;
}

export async function setModelUrl(modelUrl: string): Promise<void> {
  await setStorageData({ modelUrl });
}

export async function getVocabUrl(): Promise<string> {
  const data = await getStorageData();
  return data.vocabUrl;
}

export async function setVocabUrl(vocabUrl: string): Promise<void> {
  await setStorageData({ vocabUrl });
}
