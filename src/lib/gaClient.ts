import { BetaAnalyticsDataClient } from '@google-analytics/data';

let _analyticsDataClient: BetaAnalyticsDataClient | null = null;
let _gaProperty: string | null = null;

function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (!process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY || !process.env.GA4_PROPERTY_ID) {
    throw new Error('Missing Google Analytics environment variables');
  }

  if (!_analyticsDataClient) {
    _analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  return _analyticsDataClient;
}

function getGAProperty(): string {
  if (!process.env.GA4_PROPERTY_ID) {
    throw new Error('Missing GA4_PROPERTY_ID environment variable');
  }

  if (!_gaProperty) {
    _gaProperty = `properties/${process.env.GA4_PROPERTY_ID}`;
  }

  return _gaProperty;
}

// Lazy initialization using getters - only throws error when actually accessed, not at module load time
const analyticsDataClientObj = {} as { client: BetaAnalyticsDataClient };
Object.defineProperty(analyticsDataClientObj, 'client', {
  get: getAnalyticsClient,
  enumerable: true,
  configurable: true,
});

const gaPropertyObj = {} as { property: string };
Object.defineProperty(gaPropertyObj, 'property', {
  get: getGAProperty,
  enumerable: true,
  configurable: true,
});

// Export as proxies that forward all property access to the lazy-initialized values
export const analyticsDataClient = new Proxy({} as BetaAnalyticsDataClient, {
  get(_target, prop: string | symbol) {
    const client = getAnalyticsClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const GA_PROPERTY = new Proxy({} as object, {
  get(_target, prop: string | symbol) {
    if (prop === Symbol.toPrimitive) {
      return () => getGAProperty();
    }
    if (prop === 'toString' || prop === 'valueOf') {
      return () => getGAProperty();
    }
    const property = getGAProperty();
    return (property as unknown as Record<string | symbol, unknown>)[prop];
  },
}) as unknown as string;

