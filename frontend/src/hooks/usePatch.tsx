import { useState } from 'react'

interface UsePatchState<T> {
	data: T | null
	loading: boolean
	error: string | null
}

export default function usePatch<T>() {
	const [state, setState] = useState<UsePatchState<T>>({
		data: null,
		error: null,
		loading: false,
	})

	async function patch(
		url: string,
		payload: any,
		options?: RequestInit
	) {
		setState({ data: null, error: null, loading: true })

		const headers = new Headers(options?.headers || {})
		headers.set('Content-Type', 'application/json')

		const res = await fetch(url, {
			method: 'PATCH',
			headers,
			body: JSON.stringify(payload),
			...options,
		})

		if (!res.ok) {
			setState({data: null, error: "Something went wrong. Sorry.", loading: false})
		}
		else {
			const resData = await res.json()
			setState({data: resData, error: null, loading: false})
		}
	}

	const reset = async () => {
		setState({ data: null, error: null, loading: false })
	}

	return { patch, reset, ...state }
}
