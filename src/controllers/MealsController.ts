import { collection, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Meals } from "../models/Meals";
import { Recipe } from "../models/Recipe";

type MealsData = {
	id: string;
	data: () => {
		day: number;
		amount: number;
		lunch: string[],
		dinner: string[],
	}
}

export default class MealsController {
	private static collectionName = 'meals';

	private static isMealsData(obj: unknown): obj is MealsData {
		return (
			typeof obj === 'object' && obj !== null
			&& 'id' in obj && typeof obj.id === 'string'
			&& 'data' in obj && typeof obj.data === 'function'
			&& 'day' in obj.data() && typeof obj.data().day === 'number'
			&& 'amount' in obj.data() && typeof obj.data().amount === 'number'
			&& 'lunch' in obj.data() && typeof obj.data().lunch === 'object'
			&& 'dinner' in obj.data() && typeof obj.data().dinner === 'object'
		);
	}

	static async fetchAll(db: Firestore, recipes: Recipe[]): Promise<Meals[]> {
		const docs = await getDocs(collection(db, MealsController.collectionName));
		const result: Meals[] = [];
		docs.forEach((doc: unknown) => {
			if (MealsController.isMealsData(doc)) {
				const lunchIds: string[] = doc.data().lunch.filter((lunchId: string) => recipes.find(recipe => recipe.id === lunchId));
				const dinnerIds: string[] = doc.data().dinner.filter((dinnerId: string) => recipes.find(recipe => recipe.id === dinnerId));
				result.push({
					id: doc.id,
					day: doc.data().day,
					amount: doc.data().amount,
					lunch: lunchIds,
					dinner: dinnerIds,
				});
			}
		});
		return result.sort((a, b) => a.day - b.day);
	}

	static async update(db: Firestore, id: string, newMeals: Omit<Meals, 'id'>) {
		await updateDoc(doc(db, MealsController.collectionName, id), newMeals);
	}
}