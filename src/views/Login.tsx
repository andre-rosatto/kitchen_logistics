import { useState } from "react"
import useFirebase from "../hooks/useFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import '../css/LoginView.css';

interface LoginViewProps {
	onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
	const [showError, setShowError] = useState(false);
	const [password, setPassword] = useState('');
	const db = useFirebase();

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowError(false);
		setPassword(e.currentTarget.value);
	}

	const handleClick = async () => {
		const q = query(collection(db, 'users'), where('password', '==', password));
		const docs = await getDocs(q);
		if (docs.size > 0) {
			onLogin();
		} else {
			setShowError(true);
		}
	}

	return (
		<main className='LoginView'>
			<form>
				<h2>Login</h2>
				<label>
					Senha:
					<input
						type='password'
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				{showError && <p>Senha incorreta</p>}
				<button
					disabled={password.length === 0}
					type='button'
					onClick={handleClick}
				>Entrar</button>
			</form>
		</main>
	)
}
