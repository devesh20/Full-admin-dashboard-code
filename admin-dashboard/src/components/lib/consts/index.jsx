export function getOrderStatus(status) {
	switch (status) {
		case 'PLACED':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'CONFIRMED':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'SHIPPED':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'OUT_FOR_DELIVERY':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'DELIVERED':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		default:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
	}
}

//for stock status
export function getStockStatus(status) {
	switch (status) {
		case 'LOW STOCK':
			return (
				<div>
					<span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
						{status.replaceAll('_', ' ').toLowerCase()}
					</span>
				</div>
			)
		case 'OUT OF STOCK':
			return (
				<div>
					<span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
						{status.replaceAll('_', ' ').toLowerCase()}
					</span>
				</div>
			)
		case 'REACHED MIN THRESHOLD':
			return (
				<div>
					<span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100 text-wrap">
						{status.replaceAll('_', ' ').toLowerCase()}
					</span>
				</div>
			)
		case 'IN STOCK':
			return (
				<div>
					<span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
						{status.replaceAll('_', ' ').toLowerCase()}
					</span>
				</div>
			)
		default:
			return (
				<div>
					<span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
						{status.replaceAll('_', ' ').toLowerCase()}
					</span>
				</div>
			)
	}
}

//stock count
// export function getStockCount(status) {
// 	switch (status) {
// 		case 'LOW STOCK':
// 			return (
// 				<span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
// 					{status}
// 				</span>
// 			)
// 		case 'OUT OF STOCK':
// 			return (
// 				<span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
// 					{status}
// 				</span>
// 			)
// 		case 'REACHED MIN THRESHOLD':
// 			return (
// 				<span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100 text-wrap">
// 					{status}
// 				</span>
// 			)
// 		case 'IN STOCK':
// 			return (
// 				<span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
// 					{status}
// 				</span>
// 			)
// 		default:
// 			return (
// 				<span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
// 					{status}
// 				</span>
// 			)
// 	}
// }