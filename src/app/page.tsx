"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseAuth } from "@/firebase/auth";
import type { User } from "firebase/auth";
import { TaskHelper } from "@/tasks";
import type { ApiTask } from "@/types";

const taskHelper = new TaskHelper(new Date());

// TODO: FIREBASE SECURITY RULES

export default function Home() {
  const [visibleTasks, setVisibleTasks] = useState<ApiTask[]>([]);
  useEffect(() => {
    taskHelper.getVisibleTasks().then((tasks) => {
      setVisibleTasks(tasks);
    });
  }, []);

  const router = useRouter();

  const [/*_user*/, setUser] = useState<User | null>(null);
  const auth = new FirebaseAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        router.push("/auth");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 p-6">
      <h1 className="text-4xl font-bold text-green-500 text-center mb-8">
        🎄 Advent of Code Club 🎄
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {visibleTasks.map((task, index) => (
          <div
            key={index}
            className="relative bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 hover:border-green-600 transition transform duration-300"
          >
            <div className="absolute top-3 right-3 text-gray-500 text-xl font-bold">
              {index + 1}
            </div>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              {task.title}
            </h2>
            <p className="text-gray-400 mb-4">{task.description}</p>
            <button
              className="bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition duration-300"
              onClick={() => router.push(`/submit?id=${btoa(task.id)}`)}
            >
              Submit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
