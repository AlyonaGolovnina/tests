import { describe, expect, it } from 'vitest';
import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
  isValidCredentials,
} from './demoAuth';

describe('isValidCredentials', () => {
  it('принимает демо-логин и пароль', () => {
    expect(isValidCredentials(DEMO_USERNAME, DEMO_PASSWORD)).toBe(true);
  });

  it('отклоняет неверный пароль', () => {
    expect(isValidCredentials(DEMO_USERNAME, 'wrong')).toBe(false);
  });

  it('отклоняет неверный логин', () => {
    expect(isValidCredentials('admin', DEMO_PASSWORD)).toBe(false);
  });

  it('чувствителен к регистру логина', () => {
    expect(isValidCredentials('qa_user', DEMO_PASSWORD)).toBe(false);
  });

  it('отклоняет пустые поля', () => {
    expect(isValidCredentials('', '')).toBe(false);
    expect(isValidCredentials(DEMO_USERNAME, '')).toBe(false);
    expect(isValidCredentials('', DEMO_PASSWORD)).toBe(false);
  });
});
