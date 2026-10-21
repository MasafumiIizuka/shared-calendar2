import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

export function getFirebaseAdmin() {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? "{}",
  ) as ServiceAccount;
  const app = getApps()[0] ?? initializeApp({
    credential: cert(serviceAccount),
  });

  return {
    auth: getAuth(app),
    db: getFirestore(app),
  };
}