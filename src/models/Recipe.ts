import { Product } from "./Product";

export type Recipe = {
	id: string;
	name: string;
	products: [
		{
			product: {
				id: string,
			},
			amount: number,
		}
	],
}