export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions extends RequestInit {
  url: string;
  method?: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
  json?: boolean;
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly response: Response;

  constructor(status: number, message: string, response: Response) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.response = response;
  }
}

export class $http {
  static async request<T = any>(options: FetchOptions): Promise<T> {
    const { method = 'GET', data, headers = {}, json = true } = options;
    let { url } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data && method === 'GET') {
      const params = new URLSearchParams(data).toString();
      url = `${url}${url.includes('?') ? '&' : '?'}${params}`;
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();

      throw new HttpError(
        response.status,
        `HTTP Error: ${response.status} - ${errorText}`,
        response
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    if (json) {
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    }

    return (await response.text()) as any;
  }

  static get<T = any>(
    url: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request({
      url,
      method: 'GET',
      ...(headers ? { headers } : {}),
    });
  }

  static post<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request({
      url,
      method: 'POST',
      data,
      ...(headers ? { headers } : {}),
    });
  }

  static put<T = any>(
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...(headers ? { headers } : {}),
    });
  }

  static delete<T = any>(
    url: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request({
      url,
      method: 'DELETE',
      ...(headers ? { headers } : {}),
    });
  }
}
