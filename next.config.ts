import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path((?!finished$).*)",
        destination: "/finished",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
