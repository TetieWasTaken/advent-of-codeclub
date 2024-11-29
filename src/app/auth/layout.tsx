import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication",
  keywords: ["Authentication"],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
