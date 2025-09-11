import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json"; // relative to /lib

let adminDb: FirebaseFirestore.Firestore;

if (!admin.apps.length) {
  adminDb = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  }).firestore();
} else {
  adminDb = admin.app().firestore();
}

export { adminDb };