import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'

import useGet from '../hooks/useGet'
import usePatch from '../hooks/usePatch'

import type {Place} from '../types'

export default function DetailViewPage() {
	const navigate = useNavigate()
	const params = useParams()
	const [getURL, setGetURL] = useState(`${import.meta.env.VITE_API_URL}/${params.placeId}`)
	const [formSubmitted, setFormSubmitted] = useState(false);
	const {data, error, loading} = useGet<Place>(getURL)
	const {patch, loading: patchLoading, error: patchError} = usePatch<Place>()

	useEffect(function() {
		if(!patchLoading && !patchError && formSubmitted) {
			navigate(`/place/${params.placeId}`)
		}
	}, [patchLoading, patchError, formSubmitted])

	function handleSubmit(form: HTMLFormElement) {
		const formData = new FormData(form);
		const formDataJSON = Object.fromEntries(formData.entries());
		console.log(formDataJSON);
		patch(`${import.meta.env.VITE_API_URL}/${params.placeId}`, formDataJSON)
		setFormSubmitted(true);
	}

	return (<>
		{error ? error : loading ? "Loading data..." : data && 
			<form onSubmit={function(event) {event.preventDefault(); handleSubmit(event.target);}}>
				<div className='place-details'>
					<div className='place-detail'><strong>Name:</strong> <input type="text" name="name" defaultValue={data.name}/></div>
					<div className='place-detail'><strong>Address:</strong> <input type="text" name="address" defaultValue={data.address}/></div>
					<div className='place-detail'><strong>District:</strong> <input type="text" name="district" defaultValue={data.district}/></div>
					<div className='place-detail'><strong>Phone number:</strong> <input type="text" name="phoneNumber" defaultValue={data.phoneNumber}/></div>
					<div className='place-detail'><strong>Website:</strong> <input type="text" name="website" defaultValue={data.website}/></div>
					<div className='place-detail'><strong>Rating:</strong> <input type="number" name="rating" defaultValue={data.rating}/></div>
					<input type='submit'/>
					{patchError && patchError}
				</div>
			</form>
		}
	</>)
}
