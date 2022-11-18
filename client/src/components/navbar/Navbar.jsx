import React from 'react'
import navbarcss from '../navbar/navbar.module.css'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { useSelector} from 'react-redux'
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';

function Navbar() {
  const nav_name = useSelector(state => state.nav_name.value)

  return (
    <div className={navbarcss.main}>
        <div className={navbarcss.components} id={navbarcss.left}>{nav_name}</div>
        <div className={navbarcss.components} id={navbarcss.right}>
        <Dropdown className={navbarcss.btn}>
            <Dropdown.Toggle>
                <GridViewRoundedIcon></GridViewRoundedIcon>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{'background':'#F9F9F9' , 'minWidth':'9rem' ,'margin-top':'.5rem'}} className={navbarcss.menu}>

                <Dropdown.Item className={navbarcss.dropdown_items}>
                  <Link  to='/categories'> <CategoryIcon></CategoryIcon>  Categories</Link>
                </Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                  localStorage.clear();
                  window.location.reload();}
                  } className={navbarcss.dropdown_items} >
                  <LogoutIcon></LogoutIcon>  Log Out
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
    </div>
  )
}

export default Navbar