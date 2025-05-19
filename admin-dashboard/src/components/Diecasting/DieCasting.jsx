import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLoaderData } from 'react-router-dom';
import DataTable from '../Table/DataTable';
import {DieCastingColumns} from '../lib/consts/Columns/Diecasting'
import axios from 'axios';

function DieCasting() {
    const initialData = useLoaderData()
    
    const [data, setData] = useState(initialData)
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

    const refreshData = async () => {
      try {
        const response = await axios.get("/api/diecasting/get-all")
        setData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

  return (
    <>
      <Outlet context={{refreshData}}/>
      <div>
          <DataTable
              data={data}
              columns={DieCastingColumns}
              sorting={sorting}
              setSorting={setSorting}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showSearch={true}
              pageSize={10}
          />
      </div>
    </>
  )
}

export default DieCasting