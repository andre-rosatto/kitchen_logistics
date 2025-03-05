import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function useFirebase() {
	const app = initializeApp({
		apiKey: import.meta.env.VITE_API_KEY,
		authDomain: import.meta.env.VITE_AUTH_DOMAIN,
		projectId: import.meta.env.VITE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_STORAGE_BUCKER,
		messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_APP_ID,
	});
	const auth = getAuth(app);
	const db = getFirestore(app);

	const signIn = async (email: string, password: string): Promise<boolean> => {
		try {
			const credentials = await signInWithEmailAndPassword(auth, email, password);
			if (credentials) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}

	return { signIn, db };
}