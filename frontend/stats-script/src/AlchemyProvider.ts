import { Network, Networkish } from "@ethersproject/networks";
import { defineReadOnly } from "@ethersproject/properties";
import { ConnectionInfo } from "@ethersproject/web";
import {
  CommunityResourcable,
  showThrottleMessage,
  WebSocketProvider,
  UrlJsonRpcProvider
} from "@ethersproject/providers";
import { Logger } from "@ethersproject/logger";
import { env } from './env';
const logger = new Logger("providers/5.8.0-custom");

// This key was provided to ethers.js by Alchemy to be used by the
// default provider, but it is recommended that for your own
// production environments, that you acquire your own API key at:
//   https://dashboard.alchemyapi.io

const defaultApiKey = env.ALCHEMY_KEY;

export class AlchemyWebSocketProvider extends WebSocketProvider implements CommunityResourcable {
  readonly apiKey!: string;

  constructor(network?: Networkish, apiKey?: any) {
    const provider = new AlchemyProvider(network, apiKey);

    const url = provider.connection.url
      .replace(/^http/i, "ws")
      .replace(".alchemyapi.", ".ws.alchemyapi.");

    super(url, provider.network);
    defineReadOnly(this, "apiKey", provider.apiKey);
  }

  isCommunityResource(): boolean {
    return this.apiKey === defaultApiKey;
  }
}

export class AlchemyProvider extends UrlJsonRpcProvider {
  static getWebSocketProvider(network?: Networkish, apiKey?: any): AlchemyWebSocketProvider {
    return new AlchemyWebSocketProvider(network, apiKey);
  }

  static getApiKey(apiKey: any): any {
    if (apiKey == null) {
      return defaultApiKey;
    }
    if (apiKey && typeof apiKey !== "string") {
      logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
    }
    return apiKey;
  }

  static getUrl(network: Network, apiKey: string): ConnectionInfo {
    let host = null;
    switch (network.name) {
      case "homestead":
        host = "eth-mainnet.alchemyapi.io/v2/";
        break;
      case "goerli":
        host = "eth-goerli.g.alchemy.com/v2/";
        break;
      case "sepolia":
        host = "eth-sepolia.g.alchemy.com/v2/";
        break;
      case "matic":
        host = "polygon-mainnet.g.alchemy.com/v2/";
        break;
      case "maticmum":
        host = "polygon-mumbai.g.alchemy.com/v2/";
        break;
      case "arbitrum":
        host = "arb-mainnet.g.alchemy.com/v2/";
        break;
      case "arbitrum-goerli":
        host = "arb-goerli.g.alchemy.com/v2/";
        break;
      case "arbitrum-sepolia":
        host = "arb-sepolia.g.alchemy.com/v2/";
        break;
      case "optimism":
        host = "opt-mainnet.g.alchemy.com/v2/";
        break;
      case "optimism-goerli":
        host = "opt-goerli.g.alchemy.com/v2/";
        break;
      case "optimism-sepolia":
        host = "opt-sepolia.g.alchemy.com/v2/";
        break;
      case "bnb":
        host = "bnb-mainnet.g.alchemy.com/v2/";
      case "katana":
        host = "rpc.katanarpc.com/"
        break;
      default:
        logger.throwArgumentError("unsupported network", "network", arguments[0]);
    }

    return {
      allowGzip: true,
      url: "https:/" + "/" + host + apiKey,
      throttleCallback: (attempt: number, url: string) => {
        if (apiKey === defaultApiKey) {
          showThrottleMessage();
        }
        return Promise.resolve(true);
      }
    };
  }

  isCommunityResource(): boolean {
    return this.apiKey === defaultApiKey;
  }
}
