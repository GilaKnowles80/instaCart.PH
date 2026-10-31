import { useState } from 'react';

interface ILocationState {
	latitude: number | null;
	longitude: number | null;
	error: string | null;
	loading: boolean;
}

export const useGeolocator = () => {
	const [state, setState] = useState<ILocationState>({
		latitude: null,
		longitude: null,
		error: null,
		loading: false,
	});

	const requestPosition = () => {
		if (!navigator.geolocation) {
			setState((previousState) => ({
				...previousState,
				error: 'Geolocation context unreadable by device hardware.',
				loading: false,
			}));
			return;
		}

		setState((previousState) => ({
			...previousState,
			loading: true,
			error: null,
		}));

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					error: null,
					loading: false,
				});
			},
			(error) => {
				setState((previousState) => ({
					...previousState,
					error: error.message,
					loading: false,
				}));
			},
		);
	};

	return { ...state, requestPosition };
};
