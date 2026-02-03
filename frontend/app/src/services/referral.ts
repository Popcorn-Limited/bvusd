import { keccak256, toBytes } from "viem";
import { createClient } from "@supabase/supabase-js";

export type Referral = {
  referrer: string;
  user: string;
  created_at: string;
};

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

export function generateRefCode(address: string): string {
  const hash = keccak256(toBytes(address.toLowerCase()));
  return hash.slice(2, 20).toUpperCase();
}


export async function addReferral(
  refCode: string,
  userAddress: string
): Promise<any> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // Check if user has already a referral
    const { data: existingRefs } = await supabase
      .from("referalls")
      .select("*")
      .eq("user", userAddress);

    if (existingRefs && existingRefs.length === 0) {
      const { error } = await supabase.from("referalls").insert([
        {
          referrer: refCode,
          user: userAddress,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.log("Error adding referral", error);
        return { error: "Error adding referral" };
      }

      return { data: "Ref added" };
    } else {
      console.log("Already referred");
      return { data: "Already referred" };
    }
  } catch (error) {
    console.log("Error adding referral", error);
    return { error: "Error adding referral" };
  }
}

export async function getReferralByAddress(userAddress: string): Promise<Referral[]> {
  const refCode = generateRefCode(userAddress);

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data: ref, error } = await supabase
      .from("referalls")
      .select("*")
      .eq("referrer", refCode);

    if (error) {
      console.log("Error fetching referral", error);
      return [];
    }
    return ref;
  } catch (error) {
    console.log("Error fetching referral 2", error);
    return [];
  }
}
