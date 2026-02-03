"use server";

import { redirect } from "next/navigation";
import { sql } from "./db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { analyzeEntry } from "./ai";

const { userId } = await auth();

export async function createEntry(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const content = formData.get("content")?.toString() || "";

  // 2. THE AI HANDSHAKE
  // Instead of the user choosing a mood, the AI analyzes the content
  // and gives us both a 'mood' and an 'insight'
  const { mood, insight } = await analyzeEntry(content);

  // 3. THE DATABASE SAVE
  // Now we save the original content PLUS the two things the AI gave us
  await sql`
    INSERT INTO entries (content, mood, user_id, insight) 
    VALUES (${content}, ${mood}, ${userId}, ${insight})
  `;

  revalidatePath("/");
  redirect("/");
}

export async function deleteEntry(formData: FormData) {
  const id = formData.get("id");

  // SQL: DELETE the row where the ID matches
  await sql`DELETE FROM entries WHERE id = ${id} AND user_id = ${userId}`;

  // Refresh the page to show the entry is gone
  // We use revalidatePath to tell Next.js to clear its 'cache'
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/");
}
