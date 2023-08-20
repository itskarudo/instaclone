
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5000/graphql",
  documents: ["app/**/*.tsx", "app/**/*.ts", "utils/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "generated/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
