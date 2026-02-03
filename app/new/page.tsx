import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function NewEntryPage() {
  // This is the "Brain" of the form. It runs only on the server.
  async function createEntry(formData: FormData) {
    "use server";

    const { userId } = await auth();

    if (!userId) throw new Error("Not authorised!");

    // 1. Grab the data from the form fields
    const content = formData.get("content")?.toString();
    const mood = formData.get("mood")?.toString();

    if (!content || !mood) return;

    // 2. Insert it into your Neon database using SQL
    // $1 and $2 are "placeholders" to keep your database safe from hackers
    await sql`
    INSERT INTO entries (content, mood, user_id)
    VALUES (${content}, ${mood}, ${userId})
    `;

    // 3. Once saved, send the user back to the homepage
    redirect("/");
  }

  return (
    <main className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 text-coffee-800">New Brew</h1>

      {/* The 'action' prop tells the form to run our server function when submitted */}
      <form action={createEntry} className="flex flex-col gap-4">
        <textarea
          name="content"
          placeholder="What's on your mind today?"
          className="p-4 border-2 border-gray-200 rounded-xl text-black h-48 focus:border-brown-500 outline-none"
          required
        />

        <div className="flex items-center gap-4">
          <label className="font-medium">Today&apos;s Mood:</label>
          <select
            name="mood"
            className="p-2 border rounded-lg text-black bg-white">
            <option value="😊">Happy</option>
            <option value="😐">Okay</option>
            <option value="😴">Tired</option>
            <option value="☕">Productive</option>
            <option value="🔥">Energized</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
          Save Entry
        </button>
      </form>
    </main>
  );
}
