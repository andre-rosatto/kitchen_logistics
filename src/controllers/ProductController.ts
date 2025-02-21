import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Product } from "../models/Product";

export default class ProductController {
	private static collectionName = 'products';

	static async fetchAll(db: Firestore): Promise<Product[]> {
		const docs = await getDocs(collection(db, this.collectionName));
		const result: Product[] = [];
		docs.forEach((doc: any) => {
			if (doc.data().name && doc.data().unit) {
				result.push({
					id: doc.id,
					name: doc.data().name,
					unit: doc.data().unit,
				});
			}
		});
		return result;
	}

	static async create(db: Firestore, data: Omit<Product, 'id'>): Promise<Product> {
		const result = await addDoc(collection(db, this.collectionName), data);
		return ({
			id: result.id,
			name: data.name,
			unit: data.unit,
		});
	}

	static async delete(db: Firestore, product: Product) {
		await deleteDoc(doc(db, this.collectionName, product.id));
	}

	static async update(db: Firestore, id: string, newProduct: Omit<Product, 'id'>) {
		await updateDoc(doc(db, this.collectionName, id), newProduct);
	}
}