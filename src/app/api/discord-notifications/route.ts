import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import getRandomText from "@/contexts/RandomText";
const actions = ["created", "updated", "accepted", "deleted"] as const;
type EventAction = (typeof actions)[number];

const actionMessages: Record<EventAction, string> = {
  created: "予定を作成しました",
  updated: "予定を更新しました",
  accepted: "予定への参加を承諾しました",
  deleted: "予定を削除しました",
};

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const idToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!idToken) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  let body: { action?: EventAction; eventId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  if (
    !body.eventId ||
    typeof body.eventId !== "string" ||
    body.eventId.length > 128 ||
    !actions.includes(body.action as EventAction)
  ) {
    return NextResponse.json({ error: "操作または予定IDが不正です" }, { status: 400 });
  }

  try {
    const { auth, db } = getFirebaseAdmin();
    const user = await auth.verifyIdToken(idToken);
    const eventRef = db.collection("events").doc(body.eventId);
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
      return NextResponse.json({ error: "予定が見つかりません" }, { status: 404 });
    }

    const event = eventSnapshot.data()!;
    const action = body.action as EventAction;
    const isCreator = event.creatorId === user.uid;
    const isAttendee = Array.isArray(event.attendees) &&
      event.attendees.some((attendee: { id?: string }) => attendee.id === user.uid);

    if ((action === "created" || action === "updated" || action === "deleted") && !isCreator) {
      return NextResponse.json({ error: "この予定を操作する権限がありません" }, { status: 403 });
    }

    if (action === "accepted" && !isAttendee) {
      return NextResponse.json({ error: "参加者として確認できません" }, { status: 403 });
    }

    if (action === "deleted") {
      await eventRef.delete();
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      return NextResponse.json({ success: true, notified: false });
    }

    const displayName = action === "accepted"
      ? user.name || user.email || "ユーザー"
      : event.creatorName || user.name || user.email || "ユーザー";
    const randomText = getRandomText();

    const content = `${displayName}さんが${actionMessages[action]}\n`+
    `予定: ${String(event.title || "予定")}\n`+
    `${randomText}`;

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          allowed_mentions: { parse: [] },
        }),
      });

      if (!response.ok) {
        console.error("Discord webhook returned an error:", response.status);
        return NextResponse.json({ success: true, notified: false });
      }
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
      return NextResponse.json({ success: true, notified: false });
    }

    return NextResponse.json({ success: true, notified: true });
  } catch (error) {
    console.error("Discord notification request failed:", error);
    return NextResponse.json({ error: "通知処理に失敗しました" }, { status: 500 });
  }
}