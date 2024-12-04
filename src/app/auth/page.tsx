"use client";

import { Suspense, useEffect, useState } from "react";
import { FirebaseAuth } from "@/firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { addData } from "@/firebase/addData";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const router = useRouter();

  const auth = new FirebaseAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
        if (!user.emailVerified) {
          setError("Je email is nog niet geverifieerd, check je mail!");
        }
      }

      setIsLoggedIn(!!user);
    });
  }, [router, auth]);

  const handleSignIn = async () => {
    try {
      await auth.signInWithEmail(email, password, () => {
        router.push("/");
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) setError(error.message);
      else if (error instanceof Error) setError(error.message);
      else setError("Onbekende fout opgetreden.");
    }
  };

  const handleSignUp = async () => {
    try {
      if (!newEmail.endsWith("@gsf.nl")) {
        setError("Je kan alleen registreren met een @gsf.nl email adres.");
        return;
      }

      if (!name || name.length < 2) {
        setError("Vul een geldige naam in.");
        return;
      }

      await auth.signUpWithEmail(newEmail, newPassword, () => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            addData(`users/${user.uid}/profile`, { name }, "verycoolid");
          }
        });
        // router.push("/");
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) setError(error.message);
      else if (error instanceof Error) setError(error.message);
      else setError("Onbekende fout opgetreden.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await auth.resetPassword(email);
      setError("Wachtwoord reset email verzonden.");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) setError(error.message);
      else if (error instanceof Error) setError(error.message);
      else setError("Onbekende fout opgetreden.");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut(() => {
      });
      setError("Successvol uitgelogd.");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) setError(error.message);
      else if (error instanceof Error) setError(error.message);
      else setError("Onbekende fout opgetreden.");
    }
  };

  function EmailParamHandler() {
    const searchParams = useSearchParams();
    useEffect(() => {
      if (!searchParams) return;

      const paramValue = searchParams.get("email");
      if (paramValue) {
        try {
          setEmail(paramValue);
        } catch {
          console.error("Invalid email parameter");
        }
      }
    }, [searchParams]);
    return null;
  }

  return (
    <Suspense fallback={<div>Laden...</div>}>
      <EmailParamHandler />
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center items-center">
        <div className="w-full max-w-4xl">
          {error && (
            <div className="bg-red-500 text-white p-4 mb-6 rounded-lg shadow-lg">
              <p className="text-center">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              {isLoggedIn
                ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      Welkom terug!
                    </h2>
                    <p className="mb-4">
                      Je bent ingelogd{isEmailVerified
                        ? "! 🎉"
                        : " maar je email is nog niet geverifieerd, check je mail!"}
                    </p>
                  </>
                )
                : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Inloggen</h2>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 mb-4 border rounded border-gray-600 bg-gray-700 text-gray-200"
                    />
                    <input
                      type="password"
                      placeholder="Wachtwoord"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 mb-6 border rounded border-gray-600 bg-gray-700 text-gray-200"
                    />
                    <button
                      onClick={handleSignIn}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
                    >
                      Inloggen
                    </button>
                    <button
                      onClick={handleResetPassword}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded w-full mt-3"
                    >
                      Wachtwoord vergeten
                    </button>
                  </>
                )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              {isLoggedIn
                ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Acties</h2>
                    <button
                      onClick={handleSignOut}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
                    >
                      Uitloggen
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full mt-3"
                    >
                      Terug naar home
                    </button>
                  </>
                )
                : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      Account aanmaken
                    </h2>
                    <input
                      type="email"
                      placeholder="Email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full p-3 mb-4 border rounded border-gray-600 bg-gray-700 text-gray-200"
                    />
                    <input
                      type="password"
                      placeholder="Wachtwoord"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 mb-4 border rounded border-gray-600 bg-gray-700 text-gray-200"
                    />
                    <input
                      type="naam"
                      placeholder="Bob Alice"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 mb-4 border rounded border-gray-600 bg-gray-700 text-gray-200"
                    />
                    <button
                      onClick={handleSignUp}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
                    >
                      Account aanmaken
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
