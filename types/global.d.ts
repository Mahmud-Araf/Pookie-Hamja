interface Window {
  RequestFileSystem?: any;
  webkitRequestFileSystem?: any;
  TEMPORARY?: number;
}

interface NavigatorStorage {
  storage: {
    estimate: () => Promise<{
      quota?: number;
      usage?: number;
    }>;
  };
}

interface Navigator extends NavigatorStorage {} 