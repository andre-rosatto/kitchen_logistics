import '../css/LoadingOverlay.css';
import loadingIcon from '../assets/loading_icon.svg';

export default function LoadingOverlay() {
	return (
		<div className="LoadingOverlay">
			<img src={loadingIcon} />
		</div>
	);
}
