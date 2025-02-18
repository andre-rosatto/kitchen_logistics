import './css/App.css';
import Navbar from './components/Navbar';
import { useState } from 'react';
import ProductsView from './views/Products';
import RecipesView from './views/Recipes';

export default function App() {
	const [currentPageIdx, setCurrentPageIdx] = useState(1);

	const getCurrentPage = () => {
		switch (currentPageIdx) {
			case 0:
				return null;
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

			{getCurrentPage()}
		</div>
	);
}