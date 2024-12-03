"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { FirebaseAuth } from "@/firebase/auth";

function isAdmin(user: User | null) {
  // todo: Send API request to check if user is admin
  if (user) return true;
  return false;
}

export default function SubmitPage() {
  const router = useRouter();

  const [, setUser] = useState<User | null>(null);
  const auth = new FirebaseAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        router.push("/auth");
      } else {
        // Check if user is admin
        if (!isAdmin(user)) {
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
