import {useState} from 'react'
import {useNavigate, useParams} from 'react-router'

import useGet from '../hooks/useGet'

import type {Place} from '../types'

export default function DetailViewPage() {
	const navigate = useNavigate()
	const params = useParams()
	const [getURL, setGetURL] = useState(`${import.meta.env.VITE_API_URL}/${params.placeId}`)
	const {data, error, loading} = useGet<Place>(getURL)


	return (<>
		{error ? error : loading ? "Loading data..." : data && 
			<div className='place-details'>
				<div className='place-detail'><strong>Name:</strong> {data.name}</div>
				<div className='place-detail'><strong>Address:</strong> {data.address}</div>
				<div className='place-detail'><strong>District:</strong> {data.district}</div>
				<div className='place-detail'><strong>Phone number:</strong> {data.phoneNumber}</div>
				<div className='place-detail'><strong>Website:</strong><a href={data.website}>{data.website}</a></div>
				<div className='place-detail'><strong>Rating:</strong> {data.rating}</div>
				<div className='place-detail'><button onClick={function() {navigate(`/place/edit/${params.placeId}`)}}>Edit</button></div>
			</div>
		}
	</>)
}
