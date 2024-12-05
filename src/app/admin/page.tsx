"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { FirebaseAuth } from "@/firebase/auth";

interface AdminResponse extends Response {
  isAdmin: boolean;
}

async function isAdmin(user: User | null) {
  if (!user) return false;
  const response = await fetch(
    `/api/admin?id=${btoa(user?.uid)}`,
  ) as AdminResponse;

  const data = await response.json();
  return data.isAdmin;
}

export default function SubmitPage() {
  const router = useRouter();

  const [, setUser] = useState<User | null>(null);
  const auth = new FirebaseAuth();
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (!user) {
        router.push("/auth");
      } else {
        if (!(await isAdmin(user))) {
          router.push("/");
        }
      }
    });
  }, [router]);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Only admins can see this page</p>
    </div>
  );
}
