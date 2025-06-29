import React from 'react'
import { MdDescription, MdOutlineInventory, MdTimeline } from "react-icons/md";
import { RiOilLine } from "react-icons/ri";
import { HiOutlineChartBar } from "react-icons/hi";
import { FileBox } from 'lucide-react';
import { MdOutbox } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

function DashboardNavGrid() {
  const navigate = useNavigate()
  return (
    <div className='w-full gap-3 sm:gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <button 
        onClick={() => {navigate('/dashboard/inventory')}}
        className="w-full"
        >
            <BoxWrapper>
                <div className='rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-sky-500 shrink-0'>
                    <MdOutlineInventory className='text-xl sm:text-2xl text-white'></MdOutlineInventory>
                </div>
                <div className='px-2 sm:px-3'>
                    <strong className='text-sm sm:text-md text-gray-700 font-semibold'>Manage Inventory</strong>
                </div>
            </BoxWrapper>
        </button>
        <button 
        onClick={() => {navigate('/dashboard/production')}}
        className="w-full"
        >
            <BoxWrapper>
                <div className='rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-orange-600 shrink-0'>
                    <HiOutlineChartBar className='text-xl sm:text-2xl text-white'></HiOutlineChartBar>
                </div>
                <div className='px-2 sm:px-3'>
                    <strong className='text-sm sm:text-md text-gray-700 font-semibold'>Production Progress</strong>
                </div>
            </BoxWrapper>
        </button>    
        <button 
        onClick={() => {navigate('/dashboard/consumables')}}
        className="w-full"
        >
            <BoxWrapper>
                <div className='rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-yellow-400 shrink-0'>
                    <RiOilLine className='text-xl sm:text-2xl text-white'></RiOilLine>
                </div>
                <div className='px-2 sm:px-3'>
                    <strong className='text-sm sm:text-md text-gray-700 font-semibold'>Consumables Inventory</strong>
                </div>
            </BoxWrapper>
        </button>
        <button 
        onClick={() => {navigate('/dashboard/material-issued')}}
        className="w-full"
        >
           <BoxWrapper>
                <div className='rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-green-600 shrink-0'>
                    <MdOutbox className='text-xl sm:text-2xl text-white'></MdOutbox>
                </div>
                <div className='px-2 sm:px-3'>
                    <strong className='text-sm sm:text-md text-neutral-700 font-semibold'>Material Issued</strong>
                </div>
            </BoxWrapper>
        </button>    
    
    </div>
  )
}

function BoxWrapper({ children }) {
	return (<div className="bg-white rounded-sm p-3 sm:p-4 flex-1 border border-gray-200 flex items-center cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:bg-neutral-400/20 pr-2 sm:pr-4">{children}</div>)
}

export default DashboardNavGrid
