import { useGlobal } from '@/stores/global';
import { DrawerProps } from '@/types/dialog';
import { useEffect, useState } from 'react';

// Simple ID generator
const generateId = () => {
	return 'drawer_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

const actionTypes = {
	SHOW_DRAWER: 'SHOW_DRAWER',
	HIDE_DRAWER: 'HIDE_DRAWER',
	HIDE_ALL_DRAWERS: 'HIDE_ALL_DRAWERS',
} as const;
//
type ActionType = typeof actionTypes;

type Action = {
	type:
		| ActionType['SHOW_DRAWER']
		| ActionType['HIDE_DRAWER']
		| ActionType['HIDE_ALL_DRAWERS'];
	payload?: Partial<DrawerProps>;
	drawerId?: string;
};

// Default drawer state
const defaultDrawerState: Required<DrawerProps> = {
	id: '',
	setOpen: () => {},
	closeWhenClickOutside: false,
	title: '',
	onOk: () => {},
	okMess: '',
	loadingOk: false,
	onCancel: () => {},
	cancelMess: '',
	loadingCancel: false,
	children: '',
	contentClassname: '',
	idForm: 'userForm',
	isFooter: true,
	isHeader: true,
	isBack: true,
	closeCallback: () => {},
	data: null,
	open: false,
	description: '',
	defaultOpen: false,
	modal: false,
	onOpenChange: () => {},
	side: 'right',
};

// Use an array to store multiple drawer states
let memoryState: Required<DrawerProps>[] = [];

// Reducer to handle multiple drawers
export const reducer = (
	state: Required<DrawerProps>[],
	action: Action
): Required<DrawerProps>[] => {
	switch (action.type) {
		case 'SHOW_DRAWER': {
			const drawerProps = { ...defaultDrawerState, ...action.payload };
			// Generate a unique ID if id is not provided
			if (!drawerProps.id) {
				drawerProps.id = generateId();
			}
			drawerProps.open = true;

			// Check if a drawer with this ID already exists
			const existingDrawerIndex = state.findIndex(
				(drawer) => drawer.id === drawerProps.id
			);

			if (existingDrawerIndex >= 0) {
				// Update existing drawer
				const newState = [...state];
				newState[existingDrawerIndex] = drawerProps;
				return newState;
			} else {
				// Add new drawer
				return [...state, drawerProps];
			}
		}

		// case 'HIDE_DRAWER': {
		// 	if (action.drawerId) {
		// 		// Hide specific drawer by ID
		// 		return state.map(drawer =>
		// 			drawer.id === action.drawerId
		// 				? { ...drawer, open: false, contentClassname: '' }
		// 				: drawer
		// 		);
		// 	} else if (state.length > 0) {
		// 		// Hide the last opened drawer if no ID is provided
		// 		const lastIndex = state.length - 1;
		// 		const newState = [...state];
		// 		newState[lastIndex] = {
		// 			...newState[lastIndex],
		// 			open: false,
		// 			contentClassname: ''
		// 		};
		// 		return newState;
		// 	}
		// 	return state;
		// }
		case 'HIDE_DRAWER': {
			if (action.drawerId) {
				// Remove the drawer with specific ID instead of just hiding it
				return state.filter((drawer) => drawer.id !== action.drawerId);
			} else if (state.length > 0) {
				// Remove the last drawer instead of just hiding it
				return state.slice(0, -1);
			}
			return state;
		}

		case 'HIDE_ALL_DRAWERS': {
			// Close all drawers
			// return state.map(drawer => ({
			// 	...drawer,
			// 	open: false,
			// 	contentClassname: ''
			// }));
			return (state = []);
		}

		default:
			return state;
	}
};

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);
	listeners.forEach((listener) => {
		listener(memoryState);
	});
}

const listeners: Array<(_state: any) => void> = [];
const useDrawerRight = () => {
	const [state, setState] = useState<Required<DrawerProps>[]>(memoryState);
	const { setOpenLoading } = useGlobal();
	useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, []);

	// Get the active (last) drawer or default state if none exists
	const activeDrawer =
		state.length > 0 && state[state.length - 1].open
			? state[state.length - 1]
			: defaultDrawerState;

	const show = (props: Partial<DrawerProps>) =>
		dispatch({
			type: 'SHOW_DRAWER',
			payload: props,
		});

	// Hide function that accepts optional ID
	const hide = (id?: string) => {
		if (id) {
			// Find the drawer with this ID
			const drawer = state.find((d) => d.id === id);
			if (drawer?.closeCallback) {
				drawer.closeCallback();
			}
			dispatch({ type: 'HIDE_DRAWER', drawerId: id });
		} else if (state.length > 0) {
			// Hide the last drawer
			const lastDrawer = state[state.length - 1];
			if (lastDrawer.closeCallback) {
				lastDrawer.closeCallback();
			}
			dispatch({ type: 'HIDE_DRAWER' });
		}
	};

	// Hide all drawers
	const hideAll = () => {
		// Call closeCallback for all open drawers
		state.forEach((drawer) => {
			if (drawer.open && drawer.closeCallback) {
				drawer.closeCallback();
			}
		});
		dispatch({ type: 'HIDE_ALL_DRAWERS' });
	};

	// Hàm để tắt tất cả popup và mở lại popup đầu tiên
	const resetToFirstDrawer = () => {
		// Lưu thông tin của popup đầu tiên nếu nó tồn tại
		setOpenLoading(true);
		const firstDrawer = state.length > 0 ? { ...state[0] } : null;

		// Tắt tất cả popup
		hideAll();

		// Nếu có popup đầu tiên, mở lại nó
		if (firstDrawer) {
			// Để chắc chắn rằng drawer đã được remove khỏi state bởi hideAll
			setTimeout(() => {
				show(firstDrawer);
				setOpenLoading(false);
			}, 50);
		} else {
			setOpenLoading(false);
		}
	};
	// Trường hợp bạn muốn tắt hết và mở lại theo ID cụ thể
	const resetToDrawerById = (id: string) => {
		setOpenLoading(true);
		// Tìm drawer với ID cụ thể
		const drawer = state.find((d) => d.id === id);

		// Tắt tất cả popup
		hideAll();

		// Nếu tìm thấy drawer, mở lại nó
		if (drawer) {
			// Để chắc chắn rằng drawer đã được remove khỏi state bởi hideAll
			setTimeout(() => {
				show(drawer);
				setOpenLoading(false);
			}, 50);
		} else {
			setOpenLoading(false);
		}
	};
	// Get all drawers
	const getAllDrawers = () => state;

	const { data, ...rest } = activeDrawer;
	return {
		data,
		state: rest,
		allDrawers: state,
		show,
		hide,
		hideAll,
		getAllDrawers,
		resetToFirstDrawer,
		resetToDrawerById,
	};
};

export default useDrawerRight;
