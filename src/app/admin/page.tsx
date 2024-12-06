"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { FirebaseAuth } from "@/firebase/auth";
import { AdminHelper } from "@/admin";

interface AdminResponse extends Response {
  isAdmin: boolean;
}

interface UserForm {
  imageURLS: string[];
  note: string;
  text: string;
  timestamp: string;
  taskID: string;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  submissions: UserForm[];
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

  const [user, setUser] = useState<User | null>(null);
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

  const [userData, setUserData] = useState<UserData[] | null>(null);
  const adminHelper = new AdminHelper();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const users = await adminHelper.getUsers();
      /*const data = users.map((user) => {
        return {
          uid: user.uid,
          email: "Example Email",
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          submissions: user.submissions,
        };
      });*/

      // setUserData(data);
    })();
  }, [user]);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Only admins can see this page</p>
    </div>
  );
}
