import { auth } from "@/lib/firebase";

export type DiscordEventAction = "created" | "updated" | "accepted";

export async function notifyDiscord(eventId: string, action: DiscordEventAction) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const idToken = await user.getIdToken();
    const response = await fetch("/api/discord-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ eventId, action }),
    });

    if (!response.ok) {
      console.error("Discord notification request failed:", response.status);
    }
  } catch (error) {
    console.error("Discord notification request failed:", error);
  }
}

export async function deleteEventWithNotification(eventId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインが必要です");

  const idToken = await user.getIdToken();
  const response = await fetch("/api/discord-notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ eventId, action: "deleted" }),
  });

  if (!response.ok) {
    throw new Error("予定を削除できませんでした");
  }
}