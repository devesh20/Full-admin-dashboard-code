import React from 'react'
import { Link } from 'react-router-dom'
import { getStockStatus } from '../lib/consts'

export const MaterialUsage = [
  {
    id: '1',
    serial_no: '233',
    material_id: '4324',
    material_name: 'A-13',
    supplier_name: 'Shirley A. Lape',
    chalan_no: 'CH-234',
    material_lot__no: 'A-13-1',
    order_date: '2022-05-17T03:24:00',
    location_allocated: 'Warehouse 1',
    current_stock_status: 'REACHED MIN THRESHOLD',
    current_stock_count: '24'
  },
  {
    id: '2',
    serial_no: '234',
    material_id: '4325',
    material_name: 'B-21',
    supplier_name: 'Walter T. Roman',
    chalan_no: 'CH-235',
    material_lot__no: 'B-21-1',
    order_date: '2022-06-12T11:15:00',
    location_allocated: 'Warehouse 2',
    current_stock_status: 'IN STOCK',
    current_stock_count: '120'
  },
  {
    id: '3',
    serial_no: '235',
    material_id: '4326',
    material_name: 'C-18',
    supplier_name: 'Diane M. Flores',
    chalan_no: 'CH-236',
    material_lot__no: 'C-18-2',
    order_date: '2022-07-08T09:45:00',
    location_allocated: 'Warehouse 3',
    current_stock_status: 'LOW STOCK',
    current_stock_count: '30'
  },
  {
    id: '4',
    serial_no: '236',
    material_id: '4327',
    material_name: 'D-11',
    supplier_name: 'Roger W. Haines',
    chalan_no: 'CH-237',
    material_lot__no: 'D-11-1',
    order_date: '2022-08-20T14:00:00',
    location_allocated: 'Warehouse 1',
    current_stock_status: 'OUT OF STOCK',
    current_stock_count: '0'
  },
  {
    id: '5',
    serial_no: '237',
    material_id: '4328',
    material_name: 'E-17',
    supplier_name: 'Julia P. Abbott',
    chalan_no: 'CH-238',
    material_lot__no: 'E-17-3',
    order_date: '2022-09-15T08:30:00',
    location_allocated: 'Warehouse 4',
    current_stock_status: 'IN STOCK',
    current_stock_count: '250'
  },
  {
    id: '6',
    serial_no: '238',
    material_id: '4329',
    material_name: 'F-09',
    supplier_name: 'David R. Adams',
    chalan_no: 'CH-239',
    material_lot__no: 'F-09-2',
    order_date: '2022-10-11T10:20:00',
    location_allocated: 'Warehouse 5',
    current_stock_status: 'REACHED MIN THRESHOLD',
    current_stock_count: '15'
  },
  {
    id: '7',
    serial_no: '239',
    material_id: '4330',
    material_name: 'G-05',
    supplier_name: 'Nancy E. Carter',
    chalan_no: 'CH-240',
    material_lot__no: 'G-05-1',
    order_date: '2022-11-22T16:45:00',
    location_allocated: 'Warehouse 6',
    current_stock_status: 'LOW STOCK',
    current_stock_count: '40'
  }
]

function TrackUsage() {
  return (
    <div className="bg-white px-4 pt-2 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Track Usage</strong>
      <div className="mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th>ID</th>
              <th>Serial No</th>
              <th>Material ID</th>
              <th>Material Name</th>
              <th>Supplier Name</th>
              <th>Chalan No</th>
              <th>LOT No</th>
              <th>Order Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {MaterialUsage.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <Link to={`/material/${order.material_id}`}>
                    {order.material_id}
                  </Link>
                </td>
                <td>{order.serial_no}</td>
                <td>{order.material_name}</td>
                <td>{order.supplier_name}</td>
                <td>{order.chalan_no}</td>
                <td>{order.material_lot__no}</td>
                <td>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(order.order_date))}
                </td>
                <td>{order.location_allocated}</td>
                <td>{getStockStatus(order.current_stock_status)}</td>
                <td>{getStockStatus(order.current_stock_count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrackUsage
