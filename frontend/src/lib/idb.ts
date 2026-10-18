/** Minimal promise wrapper over IndexedDB with two stores: encrypted secrets and encrypted files. */
const DB_NAME = "provodnik";
const STORES = ["secrets", "files"] as const;
type Store = (typeof STORES)[number];

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => STORES.forEach((s) => req.result.createObjectStore(s));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(store: Store, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => {
      db.close();
      resolve(req.result);
    };
    tx.onerror = () => reject(tx.error);
  });
}

export const idbPut = (store: Store, key: string, value: unknown) => run(store, "readwrite", (s) => s.put(value, key));
export const idbGet = <T>(store: Store, key: string) => run<T | undefined>(store, "readonly", (s) => s.get(key));
export const idbDelete = (store: Store, key: string) => run(store, "readwrite", (s) => s.delete(key));
