import type { NextConfig } from "next";

// GitHub Pages serve o site em https://<user>.github.io/<repo>/,
// então precisamos de basePath/assetPrefix com o nome do repositório.
const repo = "banco-digital-60mais";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};

export default nextConfig;
