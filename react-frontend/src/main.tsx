import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard.tsx'
import { Layout } from './pages/Layout.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Layout />}>
					<Route
						index
						element={<App />}></Route>
					<Route path='dashboard'>
						<Route
							index
							element={<Navigate to='/' />}
						/>
						<Route
							path=':shortenerId'
							element={<Dashboard />}
						/>
					</Route>
					<Route
						path='*'
						element={<Navigate to='/' />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)
