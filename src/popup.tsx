
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // This includes Tailwind

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error('No #root element found');
}
