"use client";

import { useEffect } from "react";

import { useClearCart } from "@/hooks/cart";

export const ClearCart = () => {
  const { mutate } = useClearCart();

  useEffect(mutate, [mutate]);

  return null;
};
