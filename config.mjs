// Change the Telegram account here; every contact link uses this value.
export const telegramUsername = 'OUksenia';
export const telegramDraft = 'Добрый день. Хочу к вам на консультацию. Мой запрос: ';

export function telegramUrl() {
  if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(telegramUsername)) return null;
  const url = new URL(`https://t.me/${telegramUsername}`);
  url.searchParams.set('text', telegramDraft);
  return url.toString();
}
