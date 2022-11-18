import React from 'react'
import { Outlet } from 'react-router-dom'

function Without_nav() {
  console.log('came here')
  return (
    <div><Outlet/></div>
  )
}

export default Without_nav