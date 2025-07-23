"use client";

import { useAccount, useSignMessage } from "wagmi";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function GatedContent({ children }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasAccess(false);
    const authenticate = async () => {
      if (!isConnected || !address) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/api/nonce");
        const nonce = data.nonce;

        const signature = await signMessageAsync({
          account: address,
          message: nonce,
        });

        const res = await axios.post(
          "/api/verify",
          { account: address, signature, message: nonce },
          { headers: { "Content-Type": "application/json" } }
        );

        if (res.data.success) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          router.push("/");
        }
      } catch (err) {
        setHasAccess(false);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [isConnected, address]);

  if (loading) return <p>Loading authentication...</p>;

  if (hasAccess) return <>{children}</>;
}