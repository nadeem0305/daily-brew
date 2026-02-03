"use client";

import { useState } from "react";

interface Entry {
  id: number;
  content: string;
  mood: string;
  insight: string; // <-- Make sure this is here!
  created_at: Date;
}

export default function EntryCard({ entry }: { entry: Entry }) {
  const [show, setShow] = useState(false);

  return (
    <div className="border p-4 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-center">
        {/* THE AI MOOD */}
        <span className="text-3xl">{entry.mood}</span>

        {/* THE SPARKLE BUTTON */}
        <button
          onClick={() => setShow(!show)}
          className="text-amber-600 font-bold text-sm">
          {show ? "✨ Hide" : "✨ See Insight"}
        </button>
      </div>

      <p className="mt-4 text-stone-700">{entry.content}</p>

      {/* THE AI INSIGHT */}
      {show && (
        <div className="mt-4 p-4 bg-amber-50 rounded-lg italic text-stone-600 border-l-4 border-amber-200">
          &quot;{entry.insight}&quot;
        </div>
      )}
    </div>
  );
}
