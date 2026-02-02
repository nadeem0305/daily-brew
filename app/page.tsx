import { sql } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  // 1. Fetch data from Neon (Ordered by newest first)
  const entries = await sql`SELECT * FROM entries ORDER BY created_at DESC`;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif font-bold">The Daily Brew</h1>
          <Link
            href="/new"
            className="bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition">
            + New Entry
          </Link>
        </header>

        <div className="space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{entry.mood}</span>
                <time className="text-sm text-stone-500">
                  {new Date(entry.created_at).toLocaleDateString()}
                </time>
              </div>
              <p className="leading-relaxed text-lg">{entry.content}</p>
            </article>
          ))}

          {entries.length === 0 && (
            <p className="text-center text-stone-500 mt-20">
              Your brew is empty. Start writing!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
