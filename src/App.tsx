import './css/App.css';
import Navbar from './components/Navbar';
import { useState } from 'react';
import ProductsView from './views/Products';
import RecipesView from './views/Recipes';
import MealsView from './views/Meals';

export default function App() {
	const [currentPageIdx, setCurrentPageIdx] = useState(0);

	const getCurrentPage = () => {
		switch (currentPageIdx) {
			case 0:
				return <MealsView />;
			case 1:
				return <RecipesView />;
			default:
				return <ProductsView />;
		}
	}

	return (
		<div className='App'>
			<Navbar
				currentPageIdx={currentPageIdx}
				onPageChange={(newIdx) => setCurrentPageIdx(newIdx)}
			/>

			<div className='page-container'>
				{getCurrentPage()}
			</div>
		</div>
	);
}