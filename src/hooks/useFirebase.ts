import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default function useFirebase() {
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

	return db;

	// const fetchData = useCallback(async () => {
	// 	const querySnapshot = await getDocs(collection(db!, collectionName));
	// 	return querySnapshot.docs;
	// }, [collectionName]);

	// const addData = useCallback(async (data: any) => {
	// 	return await addDoc(collection(db, collectionName), data);
	// }, [collectionName]);

	// const deleteItem = useCallback(async (id: string) => {
	// 	await deleteDoc(doc(db, collectionName, id));
	// }, [collectionName]);

	// const updateItem = useCallback(async (id: string, data: any) => {
	// 	await updateDoc(doc(db, collectionName, id), data);
	// }, [collectionName]);

	// return { fetchData, addData, deleteItem, updateItem };
}