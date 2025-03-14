import withPWA from "next-pwa";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: "public",   // 서비스 워커 파일을 public 폴더에 배치
    disable: false,    // 개발 환경에서 PWA 활성화
    register: true,    // 서비스 워커 등록
    sw: "service-worker.js", // 서비스 워커 파일 이름
  },
};

/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
};

export default withPWA(nextConfig);
