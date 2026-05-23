import { useState, useEffect } from 'react'

interface UseGetState<T> {
	data: T | null
	loading: boolean
	error: string | null
	refetch?: () => void
	reset?: () => void
}

export default function useGet<T>(url: string, options?: RequestInit) {
	const [state, setState] = useState<UseGetState<T>>({
		data: null,
		loading: false,
		error: null
	})
	const [refetchIndex, setRefetchIndex] = useState(0)

	function refetch() {
		setRefetchIndex((prev) => prev + 1)
	}

	function reset() {
		setState({data: null, loading: false, error: null})
	}

	useEffect(function() {
		if (url !== '') {
			let isCancelled = false

			async function fetchData() {
				setState({data: null, loading: true, error: null})
				const headers = new Headers(options?.headers || {})
				const res = await fetch(url, {...options, headers})

				const resData = await res.json()
				if (!res.ok) {
					setState({data: null, error: "Something went wrong. Sorry.", loading: false})
				}
				else {
					if (!isCancelled) {
						setState({data: resData, error: null, loading: false})
					}
				}
			}

			fetchData()

			return function() { isCancelled = true }
		}
	}, [url, refetchIndex])

	return {...state, refetch, reset}
}
