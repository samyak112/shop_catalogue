import React from 'react'
import { Outlet } from 'react-router-dom'

function Without_nav() {
  return (
    <div><Outlet/></div>
  )
}

export default Without_nav