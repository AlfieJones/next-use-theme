import providerDefaults from "./storage.defaults";
import { GetStorageProviderType, StorageProviderType } from "./storage.types";

const getCodeInject = (type: string, key: string) => {
  switch (type) {
    case "URL": {
      return `e??e=(new URLSearchParams(location.search)).get('${key}')`;
    }
    case "LocalStorage": {
      return `e??e=(new URLSearchParams(location.search)).get('${key}')`;
    }
    case "Cookie": {
      return ``;
    }
    default: {
      return "";
    }
  }
};

const getStorageProvider = ({
  type,
  key = providerDefaults.key,
  storeUpdates = providerDefaults.key,
}: GetStorageProviderType): StorageProviderType => ({
  codeInject: getCodeInject(type, key),
});

export default getStorageProvider;
