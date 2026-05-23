import Layout from './components/Layout'
import ListingPage from './pages/ListingPage'
import SearchPage from './pages/SearchPage'
import DetailViewPage from './pages/DetailViewPage'
import DetailEditPage from './pages/DetailEditPage'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
						<Route path="/" element={<Layout />}>
							<Route path="" element={<ListingPage />} />
							<Route
								path="/search"
								element={<SearchPage />}
							/>
							<Route
								path="/place/:placeId"
								element={<DetailViewPage />}
							/>
							<Route
								path="/place/edit/:placeId"
								element={<DetailEditPage />}
							/>
						</Route>
					</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
