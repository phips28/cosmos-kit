var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/vectis.ts
var vectis_exports = {};
__export(vectis_exports, {
  wallets: () => wallets
});
module.exports = __toCommonJS(vectis_exports);

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainVectisExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/main-wallet.ts
var import_core3 = require("@cosmos-kit/core");

// src/extension/client.ts
var import_keplr = require("@chain-registry/keplr");
var VectisClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async getSimpleAccount(chainId) {
    const { address, name } = await this.client.getKey(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username: name
    };
  }
  async getAccount(chainId) {
    const {
      address,
      algo,
      pubkey,
      name,
      isNanoLedger,
      isVectisAccount
    } = await this.client.getKey(chainId);
    return {
      username: name,
      address,
      algo,
      pubkey,
      isNanoLedger,
      isSmartContract: isVectisAccount
    };
  }
  async getOfflineSigner(chainId, preferredSignType) {
    switch (preferredSignType) {
      case "amino":
        return this.getOfflineSignerAmino(chainId);
      case "direct":
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }
  getOfflineSignerAmino(chainId) {
    return this.client.getOfflineSignerAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.client.getOfflineSignerDirect(chainId);
  }
  async addChain({ chain, name, assetList, preferredEndpoints }) {
    const chainInfo = (0, import_keplr.chainRegistryChainToKeplr)(
      chain,
      assetList ? [assetList] : []
    );
    if (preferredEndpoints?.rest?.[0]) {
      chainInfo.rest = preferredEndpoints?.rest?.[0];
    }
    if (preferredEndpoints?.rpc?.[0]) {
      chainInfo.rpc = preferredEndpoints?.rpc?.[0];
    }
    await this.client.suggestChains([chainInfo]);
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    return await this.client.signAmino(signer, signDoc);
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    return await this.client.signDirect(signer, signDoc);
  }
  async signArbitrary(chainId, signer, data) {
    return await this.client.signArbitrary(chainId, signer, data);
  }
  async sendTx(chainId, tx, mode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
};

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getVectisFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const vectis = window.vectis?.cosmos;
  if (vectis) {
    return vectis;
  }
  if (document.readyState === "complete") {
    if (vectis) {
      return vectis;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (vectis) {
          resolve(vectis);
        } else {
          reject(import_core2.ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};

// src/extension/main-wallet.ts
var VectisExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainVectisExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const vectis = await getVectisFromExtension();
      this.initClientDone(vectis ? new VectisClient(vectis) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};

// src/constant.ts
var ICON = "data:image/png;base64,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";

// src/extension/registry.ts
var vectisExtensionInfo = {
  name: "vectis-extension",
  prettyName: "Vectis",
  logo: ICON,
  mode: "extension",
  mobileDisabled: true,
  rejectMessage: {
    source: "The requested action couldn't be completed, it was rejected by the user."
  },
  connectEventNamesOnWindow: ["vectis_accountChanged"],
  downloads: [
    {
      device: "desktop",
      browser: "chrome",
      link: "https://chrome.google.com/webstore/detail/vectis-wallet/cgkaddoglojnmfiblgmlinfaijcdpfjm"
    }
  ]
};

// src/vectis.ts
var vectisExtension = new VectisExtensionWallet(vectisExtensionInfo);
var wallets = [vectisExtension];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  wallets
});
//# sourceMappingURL=vectis.js.map