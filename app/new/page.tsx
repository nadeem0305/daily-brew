import { createEntry } from "@/lib/actions";

export default function NewEntryPage() {
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

        <button
          type="submit"
          className="mt-4 bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
          Save Entry
        </button>
      </form>
    </main>
  );
}
