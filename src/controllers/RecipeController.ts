import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Recipe } from "../models/Recipe";
import { Product } from "../models/Product";

export default class RecipeController {
	private static collectionName = 'recipes';

	static async fetchAll(db: Firestore, products: Product[]): Promise<Recipe[]> {
		const docs = await getDocs(collection(db, RecipeController.collectionName));
		const result: Recipe[] = [];
		docs.forEach((doc: any) => {
			if (doc.data().name && doc.data().products) {
				const recipeProducts: Recipe['products'] = [];
				doc.data().products.forEach((product: Recipe['products'][number]) => {
					if (products.find(p => p.id === product.productId)) {
						recipeProducts.push({
							amount: product.amount,
							productId: product.productId,
						});
					}
				});
				result.push({
					id: doc.id,
					name: doc.data().name,
					products: recipeProducts,
				});
			}
		});
		return result;
	}

	static async create(db: Firestore, data: Omit<Recipe, 'id'>): Promise<Recipe> {
		const result = await addDoc(collection(db, RecipeController.collectionName), data);
		return ({
			id: result.id,
			name: data.name,
			products: data.products,
		});
	}

	static async delete(db: Firestore, recipe: Recipe) {
		await deleteDoc(doc(db, this.collectionName, recipe.id));
	}

	static async update(db: Firestore, id: string, newRecipe: Omit<Recipe, 'id'>) {
		await updateDoc(doc(db, this.collectionName, id), newRecipe);
	}
}