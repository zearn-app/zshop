"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        setName(u.displayName || "");
      }
    });

    return () => unsub();
  }, [router]);

  /* ================= ACTIONS ================= */

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await user.updateProfile({
        displayName: name,
      });

      alert("Profile updated!");
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex justify-center items-center p-6">

      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">

        {/* 🔙 BACK */}
        <button
          onClick={() => router.push("/home")}
          className="text-sm text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>

        {/* 👤 PROFILE HEADER */}
        <div className="flex flex-col items-center mb-6">

          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black text-3xl font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>

          <p className="mt-3 text-lg font-semibold">
            {user?.email}
          </p>

          <p className="text-gray-400 text-sm">
            UID: {user?.uid?.slice(0, 8)}...
          </p>

        </div>

        {/* ✏️ NAME EDIT */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Name</label>

          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 outline-none"
              />
              <button
                onClick={handleSave}
                className="bg-green-600 px-3 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-1">
              <p>{name || "No name set"}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-yellow-400 text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* 📦 INFO CARDS */}
        <div className="space-y-3 mb-6">

          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Email</p>
            <p>{user?.email}</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Account Type</p>
            <p>Email/Password</p>
          </div>

        </div>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 py-3 rounded-lg hover:bg-red-400 font-semibold"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
