"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { FirebaseAuth } from "@/firebase/auth";
import { AdminHelper } from "@/admin";
import { requestData } from "@/firebase/requestData";

interface AdminResponse extends Response {
  isAdmin: boolean;
}

interface UserForm {
  images: string[];
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
  createdAt: string;
  lastLoginAt: string;
  lastSeenAt: string;
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
      console.log(user);
      console.log(await isAdmin(user));

      if (!user) {
        router.push("/auth");
      } else {
        if (!(await isAdmin(user))) {
          router.push("/");
        }
      }
    });
  }, [router]);

  const fetchUserInfo = async (userIds: string[]) => {
    const response = await fetch("/api/gu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    });

    const data = await response.json();
    return data;
  };

  const fetchUserData = async (userIds: string[]) => {
    const users = [];

    for (const userId of userIds) {
      const response = await requestData(`users/${userId}/profile/`);
      const name = response[0].name;
      users.push({ userId, name });
    }

    return users;
  };

  const getSubmissions = async (userIds: string[]) => {
    const submissions = [];

    for (const userId of userIds) {
      const response = await requestData(`users/${userId}/forms/`);
      submissions.push({ userId, submissions: response });
    }

    return submissions;
  };

  const [userData, setUserData] = useState<UserData[] | null>(null);
  const adminHelper = new AdminHelper();
  useEffect(() => {
    if (!user) return;
    (async () => {
      const users = await adminHelper.getUsers();

      const userInfo = await fetchUserInfo(users.map((user) => user.id));
      const displayNames = await fetchUserData(users.map((user) => user.id));
      const submissions = await getSubmissions(users.map((user) => user.id));

      const data = users.map((user) => {
        const currentUser: {
          uid: string;
          email: string;
          verified: boolean;
          createdAt: string;
          lastLoginAt: string;
          lastSignedInAt: string;
        } | undefined = userInfo.info.find((info: { uid: string }) =>
          info.uid === user.id
        );
        const displayName = displayNames.find(
          (displayName) => displayName.userId === user.id,
        )?.name;
        const submission = submissions.find(
          (submission) => submission.userId === user.id,
        )?.submissions;

        if (!currentUser || !displayName || !submission) {
          return null;
        }

        return {
          uid: user.id,
          email: currentUser.email,
          displayName,
          emailVerified: currentUser.verified,
          submissions: submission,
          createdAt: currentUser.createdAt,
          lastLoginAt: currentUser.lastLoginAt,
          lastSeenAt: currentUser.lastSignedInAt,
        };
      });

      setUserData(data.filter((user) => user !== null) as UserData[]);
    })();
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-gray-200">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 p-6">
      <h1 className="text-4xl font-bold text-green-500 text-center mb-8">
        🛠️ Admin 🛠️
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {userData.map((user) => (
          <div
            key={user.uid}
            className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-6 hover:shadow-xl hover:border-green-600 transition duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {user.displayName}
            </h2>
            <p className="text-gray-400 mb-2">
              <span className="font-semibold text-gray-300">Email:</span>{" "}
              {user.email}
            </p>
            <p className="text-gray-400 mb-2">
              <span className="font-semibold text-gray-300">
                Geverifieerd:
              </span>{" "}
              {user.emailVerified ? "Yes" : "No"}
            </p>
            <p className="text-gray-400 mb-2">
              <span className="font-semibold text-gray-300">Aangemaakt:</span>
              {" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-400 mb-2">
              <span className="font-semibold text-gray-300">
                Laatste Login:
              </span>{" "}
              {new Date(user.lastLoginAt).toLocaleString()}
            </p>
            <p className="text-gray-400 mb-4">
              <span className="font-semibold text-gray-300">
                Laatste keer gezien:
              </span>{" "}
              {new Date(user.lastSeenAt).toLocaleString()}
            </p>
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Opdrachten
            </h3>
            <div className="space-y-4">
              {user.submissions.map((submission) => (
                <div
                  key={submission.timestamp}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-600"
                >
                  <p className="text-gray-300 mb-2">{submission.text}</p>
                  <p className="text-gray-400 mb-2 italic">{submission.note}</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.images.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="Submission"
                        className="w-16 h-16 object-cover rounded-md border border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
