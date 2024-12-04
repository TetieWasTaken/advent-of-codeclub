"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { formData, Task } from "@/types";
import { SubmitHelper } from "@/submit";
import { User } from "firebase/auth";
import { FirebaseAuth } from "@/firebase/auth";
import { isValidTask, TaskHelper } from "@/tasks";

export default function SubmitPage() {
  const [formData, setFormData] = useState<formData>({
    text: "",
    note: "",
    files: [],
  });
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const auth = new FirebaseAuth();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        router.push("/auth");
      }
    });
  }, [router]);

  const handleInputChange = (
    e: { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFormData({
        ...formData,
        files: [...formData.files, ...Array.from(selectedFiles) as File[]],
      });
    }
  };

  function TaskIdHandler() {
    const searchParams = useSearchParams();
    useEffect(() => {
      if (!searchParams) return;

      const paramValue = searchParams.get("id");
      if (paramValue) {
        try {
          const id = atob(paramValue);

          isValidTask(id).then((isValid) => {
            if (!isValid) {
              router.push("/");
            } else {
              setTaskId(id);
            }
          });
        } catch {
          router.push("/");
        }
      }
    }, [searchParams]);
    return null;
  }

  useEffect(() => {
    if (!taskId) return;

    const taskHelper = new TaskHelper(new Date());
    taskHelper.getVisibleTasks().then((tasks) => {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        setTaskData(task);
      } else {
        router.push("/");
      }
    });
  }, [taskId]);

  if (!user) return null;

  const submitHelper = new SubmitHelper(user.uid);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await submitHelper.submit(formData, taskId!);
    alert("Ingeleverd! 🎉");
    setFormData({ text: "", note: "", files: [] });
    router.push("/");
  };

  return (
    <Suspense fallback={<div>Laden...</div>}>
      <TaskIdHandler />
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 p-6">
        <h1 className="text-4xl font-bold text-green-500 text-center mb-8">
          📝 Lever de opdracht in
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          {taskData && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-500 mb-2">
                {taskData.title}
              </h2>
              {taskData.description.split("\\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < taskData.description.split("\\n").length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </span>
              ))}
            </div>
          )}
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Tekst
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows={4}
              placeholder="Je code of antwoord..."
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="files"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Bestanden
            </label>
            <input
              id="files"
              type="file"
              name="files"
              multiple
              onChange={handleFileChange}
              className="block w-full text-gray-300 bg-gray-800 border border-gray-600 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
            />
            {formData.files.length > 0 && (
              <ul className="mt-4 text-gray-300">
                {formData.files.map((file, index) => (
                  <li key={index} className="text-sm">{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="note"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Aanvulling (optioneel)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={2}
              placeholder="Nog iets toe te voegen?"
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white font-medium py-3 px-6 rounded hover:bg-green-700 transition duration-300"
            >
              Inleveren
            </button>
          </div>
        </form>
      </div>
    </Suspense>
  );
}
