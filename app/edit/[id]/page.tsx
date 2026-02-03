import { sql } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function EditEntryPageById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  // 1. Fetch the existing entry so the user can see what they wrote
  const [entry] = await sql`SELECT * FROM entries WHERE id = ${id}`;

  if (!entry) {
    console.log("entry was not fetched from db");
    redirect("/");
  }

  // 2. The Server Action to update the database
  async function updateEntry(formData: FormData) {
    "use server";
    const newContent = formData.get("content")?.toString();
    const newMood = formData.get("mood")?.toString();

    await sql`
      UPDATE entries 
      SET content = ${newContent}, mood = ${newMood} 
      WHERE id = ${id}
    `;

    redirect("/");
  }

  return (
    <main className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Edit your Brew</h1>
      <form action={updateEntry} className="flex flex-col gap-4">
        <textarea
          name="content"
          defaultValue={entry.content} // This pre-fills the box with old data
          className="p-4 border rounded-lg text-black h-40"
          required
        />
        <select
          name="mood"
          defaultValue={entry.mood}
          className="p-2 border rounded-lg text-black">
          <option value="😊">Happy</option>
          <option value="😐">Okay</option>
          <option value="😴">Tired</option>
          <option value="☕">Productive</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg">
          Update Entry
        </button>
      </form>
    </main>
  );
}
