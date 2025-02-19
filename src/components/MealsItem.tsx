import '../css/MealsItem.css';
import { Meals } from '../models/Meals';
import { Recipe } from '../models/Recipe';
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import TableSelect from './TableSelect';

interface MealsItemProps {
	meal: Meals;
	recipes: Recipe[];
	onLunchAdd: () => void;
	onDinnerAdd: () => void;
	onLunchChange: (recipeIdx: number, newId: string) => void;
	onDinnerChange: (recipeIdx: number, newId: string) => void;
	onLunchDelete: (recipeIdx: number) => void;
	onDinnerDelete: (recipeIdx: number) => void;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function MealsItem({
	meal,
	recipes,
	onLunchAdd,
	onDinnerAdd,
	onLunchChange,
	onDinnerChange,
	onLunchDelete,
	onDinnerDelete,
}: MealsItemProps) {
	const handleLunchDelete = (recipeIdx: number) => {
		const recipe: Recipe = recipes[recipeIdx];
		if (confirm(`Tem certeza de que quer excluir esta receita do almoço?\n${recipe.name}`)) {
			onLunchDelete(recipeIdx);
		}
	}

	const handleDinnerDelete = (recipeIdx: number) => {
		const recipe: Recipe = recipes[recipeIdx];
		if (confirm(`Tem certeza de que quer excluir esta receita do jantar?\n${recipe.name}`)) {
			onDinnerDelete(recipeIdx);
		}
	}

	return (
		<div className='MealsItem'>
			<table>
				<thead>
					<tr>
						<td colSpan={2}>{DAYS[meal.day]}</td>
					</tr>
				</thead>
				<tbody>
					<tr className='meal-heading'>
						<td>Almoço</td>
						<td>
							<button
								className='buttonGood'
								title='Adicionar receita'
								onClick={onLunchAdd}
							><img src={addIcon} />
							</button>
						</td>
					</tr>
					{meal.lunch.map((recipeId, idx) => (
						<tr key={idx + recipeId}>
							<td>
								<TableSelect
									ids={recipes.map(recipe => recipe.id)}
									titles={recipes.map(recipe => recipe.name)}
									value={recipeId ?? ''}
									onSelect={id => onLunchChange(idx, id)}
								/>
							</td>
							<td>
								<button
									className='buttonBad'
									onClick={() => handleLunchDelete(idx)}
								>
									<img src={deleteIcon} />
								</button>
							</td>
						</tr>
					))}

					<tr className='meal-heading'>
						<td>Jantar</td>
						<td>
							<button
								className='buttonGood'
								title='Adicionar receita'
								onClick={onDinnerAdd}
							><img src={addIcon} />
							</button>
						</td>
					</tr>
					{meal.dinner.map((recipeId, idx) => (
						<tr key={idx + recipeId}>
							<td>
								<TableSelect
									ids={recipes.map(recipe => recipe.id)}
									titles={recipes.map(recipe => recipe.name)}
									value={recipeId ?? ''}
									onSelect={id => onDinnerChange(idx, id)}
								/>
							</td>
							<td>
								<button
									className='buttonBad'
									onClick={() => handleDinnerDelete(idx)}
								>
									<img src={deleteIcon} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
