// Type definitions for Node.js globals
declare var process: {
  env: {
    [key: string]: string | undefined;
    AZURE_FORM_RECOGNIZER_ENDPOINT?: string;
    AZURE_FORM_RECOGNIZER_KEY?: string;
    DATABASE_URL?: string;
  };
};

declare var Buffer: {
  from(arrayBuffer: ArrayBuffer): any;
};

interface AbortController {
  abort(): void;
}

interface AbortSignal {
  readonly aborted: boolean;
}

declare var AbortController: {
  prototype: AbortController;
  new(): AbortController;
};