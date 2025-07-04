import { Package } from 'lucide-react'
import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	
} from 'react-icons/hi'
import { FiPackage } from "react-icons/fi";
import { HiOutlineCalendar } from 'react-icons/hi2'
import { RiOilLine } from "react-icons/ri";

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'inventory',
		label: 'Inventory',
		path: '/dashboard/total-inventory',
		icon: <FiPackage/>
	},
	{
		key: 'orders',
		label: 'Orders',
		path: '/dashboard/orders',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'workers',
		label: 'Workers',
		path: '/dashboard/workers',
		icon: <HiOutlineUsers />
	},
	{
		key: 'reports',
		label: 'Reports',
		path: '/dashboard/report',
		icon: <HiOutlineDocumentText />
	},
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	// {
	// 	key: 'support',
	// 	label: 'Help',
	// 	path: '/dashboard/support',
	// 	icon: <HiOutlineQuestionMarkCircle />
	// },
]