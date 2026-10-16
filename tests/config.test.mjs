import test from 'node:test';
import assert from 'node:assert/strict';

import { telegramUrl } from '../config.mjs';

test('Telegram link contains the configured account and message draft', () => {
  const url = new URL(telegramUrl());
  assert.equal(url.origin, 'https://t.me');
  assert.equal(url.pathname, '/OUksenia');
  assert.equal(url.searchParams.get('text'), 'Добрый день. Хочу к вам на консультацию. Мой запрос: ');
});
