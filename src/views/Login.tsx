import { useState } from "react"
import useFirebase from "../hooks/useFirebase";
import '../css/LoginView.css';

interface LoginViewProps {
	onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
	const [showError, setShowError] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signIn } = useFirebase();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowError(false);
		setEmail(e.currentTarget.value);
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowError(false);
		setPassword(e.currentTarget.value);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (await signIn(email, password)) {
			onLogin();
		} else {
			setShowError(true);
		}
	}

	return (
		<main className='LoginView'>
			<form onSubmit={handleSubmit}>
				<h2>Login</h2>
				<label>
					E-mail:
					<input
						autoFocus
						type='email'
						required
						value={email}
						onChange={handleEmailChange}
					/>
				</label>
				<label>
					Senha:
					<input
						type='password'
						required
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				{showError && <p>E-mail ou senha incorreta</p>}
				<button disabled={password.length === 0 || email.trim().length === 0}>Entrar</button>
			</form>
		</main>
	)
}
