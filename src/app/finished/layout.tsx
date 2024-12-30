import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finished",
  description: "Finished",
  keywords: ["Finished"],
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
