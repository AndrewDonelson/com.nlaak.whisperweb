// file: @/lib/ledger/device.ts

import { openDB, IDBPDatabase } from 'idb';

interface DeviceInfo {
  id: string;
  isMobile: boolean;
}

class DeviceManager {
  private db: IDBPDatabase | null = null;
  private deviceInfo: DeviceInfo | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    this.db = await openDB('LedgerDeviceStore', 1, {
      upgrade(db) {
        db.createObjectStore('deviceInfo');
        db.createObjectStore('ledgerData');
      },
    });
  }

  public async getDeviceInfo(): Promise<DeviceInfo> {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }

    await this.ensureDBInitialized();

    let deviceInfo = await this.db!.get('deviceInfo', 'current');
    if (!deviceInfo) {
      deviceInfo = {
        id: this.generateDeviceId(),
        isMobile: this.checkIfMobile(),
      };
      await this.db!.put('deviceInfo', deviceInfo, 'current');
    }

    this.deviceInfo = deviceInfo;
    return deviceInfo;
  }

  private generateDeviceId(): string {
    // Generate a unique ID using a combination of timestamp and random numbers
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${random}`;
  }

  private checkIfMobile(): boolean {
    // Check if the device is mobile based on user agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

  public async getData(key: string): Promise<any> {
    await this.ensureDBInitialized();
    return this.db!.get('ledgerData', key);
  }

  public async setData(key: string, value: any): Promise<void> {
    await this.ensureDBInitialized();
    await this.db!.put('ledgerData', value, key);
  }

  private async ensureDBInitialized(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }
}

// Export a singleton instance of DeviceManager
export const deviceManager = new DeviceManager();

// Utility functions
export async function getDeviceId(): Promise<string> {
  const deviceInfo = await deviceManager.getDeviceInfo();
  return deviceInfo.id;
}

export async function isMobileDevice(): Promise<boolean> {
  const deviceInfo = await deviceManager.getDeviceInfo();
  return deviceInfo.isMobile;
}

export async function storeData(key: string, value: any): Promise<void> {
  await deviceManager.setData(key, value);
}

export async function retrieveData(key: string): Promise<any> {
  return deviceManager.getData(key);
}