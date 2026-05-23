import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router'

import useGet from '../hooks/useGet'

import type {Place} from '../types'

export default function SearchPage() {
	const navigate = useNavigate()
	const [getURL, setGetURL] = useState(`${import.meta.env.VITE_API_URL}/`)
	const {data, error, loading} = useGet<Place[]>(getURL)
	const [district, setDistrict] = useState("")
	const [name, setName] = useState("")

	useEffect(function() {
		setGetURL(`${import.meta.env.VITE_API_URL}/?name=${name}&district=${district}`)
	}, [name, district])

	return (<>
			<ul className='place-list'>
			<div className='search-inputs'>
				<input type="text" placeholder="Name" value={name} onChange={function(e) {setName(e.target.value)}}/>
				<input type="text" placeholder="District" value={district} onChange={function(e) {setDistrict(e.target.value)}}/>
			</div>
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
	</ul>
	</>)
}
