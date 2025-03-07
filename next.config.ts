import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
};

export default withPWA(nextConfig);
