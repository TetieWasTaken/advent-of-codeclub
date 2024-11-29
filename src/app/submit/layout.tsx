import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit",
  description: "Submit",
  keywords: ["Submit"],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
