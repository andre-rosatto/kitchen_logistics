import { useRef, useState } from "react"
import useFirebase from "../hooks/useFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import '../css/LoginView.css';

interface LoginViewProps {
	onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
	const [showError, setShowError] = useState(false);
	const [password, setPassword] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const db = useFirebase();

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowError(false);
		setPassword(e.currentTarget.value);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const q = query(collection(db, 'users'), where('password', '==', password));
		const docs = await getDocs(q);
		if (docs.size > 0) {
			onLogin();
		} else {
			setShowError(true);
			setPassword('');
			inputRef.current?.focus();
		}
	}

	return (
		<main className='LoginView'>
			<form onSubmit={handleSubmit}>
				<h2>Login</h2>
				<label>
					Senha:
					<input
						ref={inputRef}
						autoFocus
						type='password'
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				{showError && <p>Senha incorreta</p>}
				<button disabled={password.length === 0}>Entrar</button>
			</form>
		</main>
	)
}
