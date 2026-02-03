const REFERRAL_STORAGE_KEY = "bvusd:referral_code";

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function setReferralCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFERRAL_STORAGE_KEY, code);
}

export function clearReferralCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}
