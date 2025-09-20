// Polyfill para fetch API
// Compatible con navegadores que no soportan fetch nativo

if (!('fetch' in window)) {
  // Implementación básica de fetch usando XMLHttpRequest

  interface FetchInit {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    integrity?: string;
    keepalive?: boolean;
    signal?: AbortSignal | null;
  }

  class Response {
    public readonly headers: Headers;
    public readonly ok: boolean;
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly body: ReadableStream<Uint8Array> | null;
    public readonly bodyUsed: boolean = false;
    private _body: string | ArrayBuffer | Blob | FormData | URLSearchParams;

    constructor(
      body: string | ArrayBuffer | Blob | FormData | URLSearchParams = '',
      options: {
        status?: number;
        statusText?: string;
        headers?: HeadersInit;
        url?: string;
      } = {}
    ) {
      this._body = body;
      this.status = options.status || 200;
      this.statusText = options.statusText || 'OK';
      this.ok = this.status >= 200 && this.status < 300;
      this.url = options.url || '';
      this.headers = new Headers(options.headers);
      this.body = null; // Simplificado para el polyfill
    }

    async text(): Promise<string> {
      if (this.bodyUsed) {
        throw new TypeError('Body has already been consumed');
      }
      (this as any).bodyUsed = true;

      if (typeof this._body === 'string') {
        return this._body;
      }

      if (this._body instanceof ArrayBuffer) {
        return new TextDecoder().decode(this._body);
      }

      if (this._body instanceof Blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(this._body as Blob);
        });
      }

      return String(this._body);
    }

    async json(): Promise<any> {
      const text = await this.text();
      return JSON.parse(text);
    }

    async blob(): Promise<Blob> {
      if (this.bodyUsed) {
        throw new TypeError('Body has already been consumed');
      }
      (this as any).bodyUsed = true;

      if (this._body instanceof Blob) {
        return this._body;
      }

      return new Blob([this._body as any]);
    }

    async arrayBuffer(): Promise<ArrayBuffer> {
      if (this.bodyUsed) {
        throw new TypeError('Body has already been consumed');
      }
      (this as any).bodyUsed = true;

      if (this._body instanceof ArrayBuffer) {
        return this._body;
      }

      const text = await this.text();
      const encoder = new TextEncoder();
      return encoder.encode(text).buffer;
    }

    async formData(): Promise<FormData> {
      throw new Error('FormData response parsing not implemented in polyfill');
    }

    clone(): Response {
      if (this.bodyUsed) {
        throw new TypeError('Body has already been consumed');
      }

      return new Response(this._body, {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        url: this.url
      });
    }
  }

  class Headers {
    private _headers: { [key: string]: string } = {};

    constructor(init?: HeadersInit) {
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, key) => {
            this.append(key, value);
          });
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => {
            this.append(key, value);
          });
        } else {
          Object.entries(init).forEach(([key, value]) => {
            this.append(key, value);
          });
        }
      }
    }

    append(name: string, value: string): void {
      name = name.toLowerCase();
      if (this._headers[name]) {
        this._headers[name] += ', ' + value;
      } else {
        this._headers[name] = value;
      }
    }

    delete(name: string): void {
      delete this._headers[name.toLowerCase()];
    }

    get(name: string): string | null {
      return this._headers[name.toLowerCase()] || null;
    }

    has(name: string): boolean {
      return name.toLowerCase() in this._headers;
    }

    set(name: string, value: string): void {
      this._headers[name.toLowerCase()] = value;
    }

    forEach(callback: (value: string, key: string, parent: Headers) => void): void {
      Object.entries(this._headers).forEach(([key, value]) => {
        callback(value, key, this);
      });
    }

    entries(): IterableIterator<[string, string]> {
      return Object.entries(this._headers)[Symbol.iterator]();
    }

    keys(): IterableIterator<string> {
      return Object.keys(this._headers)[Symbol.iterator]();
    }

    values(): IterableIterator<string> {
      return Object.values(this._headers)[Symbol.iterator]();
    }

    [Symbol.iterator](): IterableIterator<[string, string]> {
      return this.entries();
    }
  }

  function fetch(input: RequestInfo | URL, init: FetchInit = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = typeof input === 'string' ? input : input.toString();
      const method = (init.method || 'GET').toUpperCase();

      xhr.open(method, url, true);

      // Configurar headers
      const headers = new Headers(init.headers);
      headers.forEach((value, key) => {
        xhr.setRequestHeader(key, value);
      });

      // Configurar credenciales
      if (init.credentials === 'include') {
        xhr.withCredentials = true;
      }

      // Configurar timeout
      xhr.timeout = 30000; // 30 segundos por defecto

      xhr.onload = () => {
        const responseHeaders: { [key: string]: string } = {};

        if (xhr.getAllResponseHeaders) {
          xhr.getAllResponseHeaders().split('\r\n').forEach(line => {
            const parts = line.split(': ');
            if (parts.length === 2) {
              responseHeaders[parts[0].toLowerCase()] = parts[1];
            }
          });
        }

        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: responseHeaders,
          url: xhr.responseURL || url
        });

        resolve(response);
      };

      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = () => {
        reject(new TypeError('Network request timed out'));
      };

      xhr.onabort = () => {
        reject(new TypeError('Network request aborted'));
      };

      // Enviar la petición
      if (init.body) {
        if (typeof init.body === 'string') {
          xhr.send(init.body);
        } else if (init.body instanceof FormData) {
          xhr.send(init.body);
        } else if (init.body instanceof URLSearchParams) {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.send(init.body.toString());
        } else {
          xhr.send(String(init.body));
        }
      } else {
        xhr.send();
      }
    });
  }

  // Asignar a window
  (window as any).fetch = fetch;
  (window as any).Headers = Headers;
  (window as any).Response = Response;
}

export {};