import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
const initialState = window.__INITIAL_STATE__ || { ssr: false };
const initialAuthUser = initialState.user || null;
const app = <App initialAuthUser={initialAuthUser} isSSRMode={Boolean(initialState.ssr)} />;

const shouldHydrate = Boolean(initialState.ssr) && Boolean(root?.firstElementChild);

if (shouldHydrate) {
	hydrateRoot(root, app);
} else {
	createRoot(root).render(app);
}