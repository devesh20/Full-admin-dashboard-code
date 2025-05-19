import React from 'react'
import { Link } from 'react-router-dom';
import DashboardNavGrid from '../Dashboard-Nav-Grid/DashboardNavGrid';
import RejectionChart from '../Rejection-Chart/RejectionChart';
import RejectionByCause from '../Rejection-Chart/RejectionByCause';
import PopularProducts from '../Popular-Products/PopularProducts';
import TrackUsage from '../Track-Usage/TrackUsage';

export default function Dashboard() {
    // console.log("Dashboard is rendering");
    
  return (
    <div className='flex flex-col gap-4 w-full overflow-hidden bg-fixed '>
        <div className="flex-1">
        <DashboardNavGrid/>
        </div>
        <div className='flex flex-col md:flex-row gap-4 w-full h-full'>
            <RejectionChart/>
            <RejectionByCause/>
        </div>
    </div>
  )
}
