import {useState} from 'react'
import {useNavigate} from 'react-router'

import useGet from '../hooks/useGet'

import type {Place} from '../types'

export default function ListingPage() {
	const navigate = useNavigate()
	const [getURL, setGetURL] = useState(`${import.meta.env.VITE_API_URL}/`)
	const {data, error, loading} = useGet<Place[]>(getURL)


	return (<ul className='place-list'>
			{error ? error : loading ? "Loading data..." : data && data.map(function(element) {
				return (
					<li 
						className='place-list-item'
						onClick={function() {navigate(`/place/${element.id}`)}}
					>
						<div className='place-name'>{element.name}</div>
						<div className='place-district'>{element.district}</div>
						<div className='place-rating'>{element.rating}</div>
					</li>
				)
			})}
	</ul>)
}
