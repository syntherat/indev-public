"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchAccountOrders } from "@/lib/accountApi";

export default function usePurchasedProductIds() {
  const { status } = useAuth();
  const [purchasedIds, setPurchasedIds] = useState(() => new Set());

  useEffect(() => {
    let isActive = true;

    const loadPurchasedIds = async () => {
      if (status !== "authenticated") {
        setPurchasedIds(new Set());
        return;
      }

      try {
        const payload = await fetchAccountOrders();
        if (!isActive) {
          return;
        }

        const nextIds = new Set();
        for (const order of payload?.data?.items || []) {
          for (const item of order?.items || []) {
            if (item?.productId) {
              nextIds.add(String(item.productId));
            }
          }
        }

        setPurchasedIds(nextIds);
      } catch (_error) {
        if (isActive) {
          setPurchasedIds(new Set());
        }
      }
    };

    loadPurchasedIds();

    return () => {
      isActive = false;
    };
  }, [status]);

  return useMemo(() => purchasedIds, [purchasedIds]);
}