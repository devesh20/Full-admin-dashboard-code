import React from 'react'
import { Link } from 'react-router-dom'

export default function Products() {
//   console.log("Products Component Rendered")
  return (
    <div>
        <p>This is Products</p>
        <Link
        to={"/"}
        className=''
        >Go to Dashboard</Link>
    </div>
  )
}
