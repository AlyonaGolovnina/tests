export const DEMO_USERNAME = 'QA_user';
export const DEMO_PASSWORD = 'Brew4QA!';

export function isValidCredentials(username: string, password: string): boolean {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}
