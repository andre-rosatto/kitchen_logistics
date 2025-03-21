import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Product } from "../models/Product";

type ProductData = {
	id: string;
	data: () => {
		name: string;
		unit: string;
		x1000: string;
	};
}

export default class ProductController {
	private static collectionName = 'products';

	private static isProductData(obj: unknown): obj is ProductData {
		return (
			typeof obj === 'object' && obj !== null
			&& 'id' in obj && typeof obj.id === 'string'
			&& 'data' in obj && typeof obj.data === 'function'
			&& 'name' in obj.data() && typeof obj.data().name === 'string' && obj.data().name.trim().length > 0
			&& 'unit' in obj.data()
		);
	}

	static async fetchAll(db: Firestore): Promise<Product[]> {
		const docs = await getDocs(collection(db, ProductController.collectionName));
		const result: Product[] = [];
		docs.forEach((doc: unknown) => {
			if (ProductController.isProductData(doc)) {
				result.push({
					id: doc.id,
					name: doc.data().name,
					unit: doc.data().unit,
					x1000: doc.data().x1000 ?? '',
				});
			} else if (typeof doc === 'object' && doc !== null && 'id' in doc) {
				ProductController.delete(db, doc as Product);
			}
		});
		return result.sort((a, b) => a.name.localeCompare(b.name));
	}

	static async create(db: Firestore, data: Omit<Product, 'id'>): Promise<Product> {
		const result = await addDoc(collection(db, ProductController.collectionName), data);
		return ({
			id: result.id,
			name: data.name,
			unit: data.unit,
			x1000: data.x1000 ?? '',
		});
	}

	static async delete(db: Firestore, product: Product) {
		await deleteDoc(doc(db, this.collectionName, product.id));
	}

	static async update(db: Firestore, id: string, newProduct: Omit<Product, 'id'>) {
		await updateDoc(doc(db, this.collectionName, id), newProduct);
	}
}