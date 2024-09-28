export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, handler: (arr: string[]) => void) => void;
  removeListener: (eventName: string, handler: (arr: string[]) => void) => void;
  isConnected: () => boolean;
}
