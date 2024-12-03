import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
  keywords: ["Admin"],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
