import { renderToString } from 'react-dom/server';
import App from './App';
import './index.css';

export function render(_url, initialState = {}) {
  return renderToString(<App initialAuthUser={initialState.user || null} />);
}