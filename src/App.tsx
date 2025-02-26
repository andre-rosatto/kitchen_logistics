import './css/App.css';
import Navbar from './components/Navbar';
import { useState } from 'react';
import ProductsView from './views/Products';
import RecipesView from './views/Recipes';
import MealsView from './views/Meals';
import LoginView from './views/Login';

export default function App() {
	const [currentPageIdx, setCurrentPageIdx] = useState(-1);

	const getCurrentPage = () => {
		switch (currentPageIdx) {
			case 0:
				return <MealsView />;
			case 1:
				return <RecipesView />;
			case 2:
				return <ProductsView />;
			default:
				return (
					<LoginView
						onLogin={() => setCurrentPageIdx(0)}
					/>
				);
		}
	}

	return (
		<div className='App'>
			{currentPageIdx >= 0 && <Navbar
				currentPageIdx={currentPageIdx}
				onPageChange={(newIdx) => setCurrentPageIdx(newIdx)}
			/>}

			<div className='page-container'>
				{getCurrentPage()}
			</div>
		</div>
	);
}