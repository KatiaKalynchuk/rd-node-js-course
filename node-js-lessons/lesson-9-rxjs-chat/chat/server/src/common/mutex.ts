export class Mutex {
  private mutex = Promise.resolve();

  constructor(private readonly resourceId?: string) {}

  async lock(): Promise<() => void> {
    let unlockNext: () => void;

    const willLock = new Promise<void>((resolve) => {
      unlockNext = () => resolve();
    });

    const previous = this.mutex;
    this.mutex = this.mutex.then(() => willLock);

    await previous;

    return unlockNext!;
  }

  async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.lock();

    try {
      return await callback();
    } finally {
      release();
    }
  }
}
