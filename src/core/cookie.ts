interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export const $cookie = {
  get(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();

    return undefined;
  },

  set(name: string, value: string, options: CookieOptions = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge !== undefined) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.httpOnly) {
      cookieString += `; httponly`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;

    return this;
  },

  delete(name: string, path = '/', domain?: string) {
    let cookieString = `${encodeURIComponent(
      name
    )}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  },
};
