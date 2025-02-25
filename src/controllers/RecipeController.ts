import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Recipe } from "../models/Recipe";
import { Product } from "../models/Product";

type RecipeData = {
	id: string;
	data: () => {
		name: string;
		products: {
			productId: string;
			amount: number;
		}[];
	}
}

export default class RecipeController {
	private static collectionName = 'recipes';

	private static isRecipeData(obj: unknown): obj is RecipeData {
		return (
			typeof obj === 'object' && obj !== null
			&& 'id' in obj && typeof obj.id === 'string'
			&& 'data' in obj && typeof obj.data === 'function'
			&& 'name' in obj.data() && typeof obj.data().name === 'string' && obj.data().name.trim().length > 0
			&& 'products' in obj.data() && typeof obj.data().products === 'object'
		);
	}

	static async fetchAll(db: Firestore, products: Product[]): Promise<Recipe[]> {
		const docs = await getDocs(collection(db, RecipeController.collectionName));
		const result: Recipe[] = [];
		docs.forEach((doc: unknown) => {
			if (RecipeController.isRecipeData(doc)) {
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
		return result.sort((a, b) => a.name.localeCompare(b.name));
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