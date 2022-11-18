import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import withnavcss from '../With_nav/withnav.module.css'

function With_nav() {
  return (
    <>
      <div className={withnavcss.main}>
        <div className={withnavcss.item_1}><Navbar/></div>
        <div className={withnavcss.item_2}><Outlet/></div>
          
         
        </div>
    </>
  )
}

export default With_nav