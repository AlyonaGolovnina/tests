const SESSION_KEY = 'qa-coffee-shop-session';

export type Session = {
  username: string;
};

export function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Session;
    if (typeof parsed.username !== 'string' || parsed.username.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
