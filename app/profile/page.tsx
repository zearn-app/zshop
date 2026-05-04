"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setName(u.displayName || "");
      }
    });

    return () => unsub();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await updateProfile(user, {
        displayName: name,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl mb-4 text-green-400">Profile</h1>

        <div className="mb-3">
          <label className="text-sm text-gray-400">Email</label>
          <div className="bg-[#222] p-2 rounded mt-1">
            {user?.email}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-400">Display Name</label>
          <input
            className="w-full p-2 rounded bg-[#222] mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-green-500 py-2 rounded mt-4"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}