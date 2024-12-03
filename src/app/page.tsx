"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseAuth } from "@/firebase/auth";
import type { User } from "firebase/auth";
import { TaskHelper, taskSubmitted } from "@/tasks";
import type { Task } from "@/types";

const taskHelper = new TaskHelper(new Date());

// TODO: FIREBASE SECURITY RULES

export default function Home() {
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const auth = new FirebaseAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        router.push("/auth");
      }
    });
  }, [router, auth]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const tasks = await taskHelper.getVisibleTasks();

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const submitted = await taskSubmitted(task.id, user!.uid);
          return { ...task, submitted };
        }),
      );

      setVisibleTasks(updatedTasks);
    })();
  }, [user]);

  const [expandedDescription, setExpandedDescription] = useState<Set<string>>(
    new Set(),
  );

  const toggleDescription = (taskId: string) => {
    setExpandedDescription((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
      } else {
        newExpanded.add(taskId);
      }
      return newExpanded;
    });
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 p-6">
      <h1 className="text-4xl font-bold text-green-500 text-center mb-8">
        🎄 Advent of Code Club 🎄
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {visibleTasks.map((task, index) => (
          <div
            key={index}
            className={`relative border rounded-lg shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition transform duration-300 ${
              task.submitted
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-700 border-gray-600 hover:border-green-600"
            }`}
          >
            <div className="absolute top-3 right-3 text-gray-500 text-xl font-bold">
              {index + 1}
            </div>
            <h2
              className={`text-xl font-semibold ${
                task.submitted ? "text-gray-500" : "text-gray-100"
              } mb-3`}
            >
              {task.title}
            </h2>
            <div
              className={`${
                task.submitted ? "text-gray-600" : "text-gray-400"
              } mb-4`}
            >
              {task.description.slice(0, 100).split("\\n").map((
                line,
                index,
              ) => (
                <span key={index}>
                  {line}
                  {index <
                      task.description.slice(0, 100).split("\\n").length - 1 &&
                    (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                </span>
              ))}
              {task.description.length > 100 &&
                !expandedDescription.has(task.id) && (
                <>
                  {"..."}
                  <button
                    onClick={() => toggleDescription(task.id)}
                    className="text-green-500 inline-block"
                  >
                    Uitklappen
                  </button>
                </>
              )}
              {expandedDescription.has(task.id) && (
                <>
                  {task.description.slice(100).split("\\n").map((
                    line,
                    index,
                  ) => (
                    <span key={index}>
                      {line}
                      {index <
                          task.description.slice(100).split("\\n").length - 1 &&
                        (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                    </span>
                  ))}
                  <button
                    onClick={() => toggleDescription(task.id)}
                    className="text-green-500 inline-block"
                  >
                    Inklappen
                  </button>
                </>
              )}
            </div>

            <button
              className={`font-medium py-2 px-4 rounded transition duration-300 ${
                task.submitted
                  ? "bg-green-900 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => {
                if (!task.submitted) {
                  router.push(`/submit?id=${btoa(task.id)}`);
                }
              }}
            >
              Inleveren
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
