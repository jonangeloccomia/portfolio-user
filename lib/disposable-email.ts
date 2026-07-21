import disposableDomains from "disposable-email-domains";

const DISPOSABLE_DOMAINS = new Set(disposableDomains);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}
