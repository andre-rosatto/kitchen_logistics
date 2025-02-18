import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, addDoc, deleteDoc, doc } from "firebase/firestore";

export default function useFirebase(collectionName: string) {
	const firebaseConfig = {
		apiKey: "AIzaSyDoSV2FWJW3nsx1K_xtYIFPwHdi8NW1wnk",
		authDomain: "kitchen-logistics-fd49c.firebaseapp.com",
		projectId: "kitchen-logistics-fd49c",
		storageBucket: "kitchen-logistics-fd49c.firebasestorage.app",
		messagingSenderId: "129263073356",
		appId: "1:129263073356:web:7eb2baa69f5af7b2c61ce9"
	};
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	const fetchData = async () => {
		const querySnapshot = await getDocs(collection(db!, collectionName));
		return querySnapshot.docs;
	}

	const addData = async (data: any) => {
		return await addDoc(collection(db, collectionName), data);
	}

	const deleteItem = async (id: string) => {
		await deleteDoc(doc(db, collectionName, id));
	}

	return { fetchData, addData, deleteItem };
}