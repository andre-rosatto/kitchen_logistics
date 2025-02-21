export type Recipe = {
	id: string;
	name: string;
	products: {
		productId: string,
		amount: number,
	}[],
}