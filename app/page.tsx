import { sql } from "@/lib/db";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import EntryCard from "./components/EntryCard";

interface Entry {
  id: number;
  content: string;
  mood: string;
  insight: string; // <-- Make sure this is here!
  created_at: Date;
}

export default async function Home() {
  // get verified user
  const { userId } = await auth();

  // 1. Fetch data from Neon (Ordered by newest first)
  const entries = (await sql`
    SELECT * FROM entries 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `) as Entry[];

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Daily Brews</h1>
        {/* Your Link to /new */}
        <Link
          href="/new"
          className="bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition">
          + New Entry
        </Link>
      </header>

      <div className="grid gap-6">
        {entries.map((entry) => (
          // 2. Use the component here and pass the 'entry' as a prop
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}
