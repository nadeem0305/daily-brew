import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  // get verified user
  const { userId } = await auth();

  // 1. Fetch data from Neon (Ordered by newest first)
  const entries = await sql`
    SELECT * FROM entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  async function deleteEntry(formData: FormData) {
    "use server";
    const id = formData.get("id");

    // SQL: DELETE the row where the ID matches
    await sql`DELETE FROM entries WHERE id = ${id} AND user_id = ${userId}`;

    // Refresh the page to show the entry is gone
    // We use revalidatePath to tell Next.js to clear its 'cache'
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
  }

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
                  {new Date(entry.created_at).toLocaleDateString("en-US")}
                </time>
              </div>
              <p className="leading-relaxed text-lg">{entry.content}</p>

              <div className="flex gap-4">
                <Link
                  href={`/edit/${entry.id}`}
                  className="text-stone-500 hover:underline">
                  Edit
                </Link>

                {/* Your existing Delete form here */}
                <form action={deleteEntry}>
                  {/* We hide the ID in a secret input so the Action knows which one to kill */}
                  <input type="hidden" name="id" value={entry.id} />
                  <button
                    type="submit"
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                    Delete
                  </button>
                </form>
              </div>
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
