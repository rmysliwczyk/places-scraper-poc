import { Outlet, useNavigate } from 'react-router'

const pages = [
	{ label: 'Search', path: '/search', id: 'search' },
	{ label: 'Listing', path: '/', id: 'listing' },
]

export default function Layout() {
	const navigate = useNavigate()
	return (
	<>
		<nav className='navbar'>
		<ul>
		{pages.map((page) => (
			<li
			key={page.label}
			onClick={function() {navigate(page.path)}}
			>
				{page.label}
			</li>
		))}
		</ul>
		</nav>
		<main className='main-content'>
			<Outlet/>
		</main>
	</>
	)
}
