import React, { useEffect } from 'react'
import categorycss from '../categories/categories.module.css'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Item_modal from '../item_modal/Item_modal';
import { useDispatch } from 'react-redux'
import { change_nav_value } from '../Redux/navbar_slice';


function Categories() {
  const [categories, setcategories] = useState([])
  const [button_color, setbutton_color] = useState('#ECC5FB')
  const dispatch = useDispatch();
  // this array is just made to get 4 instance of loading card
  const loading_cards = [1,2,3,4,5,6]   
  
  const handle_modal = (value) =>{
    setShow(value)
    setbutton_color('#ECC5FB'); 
  }

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  
  function button_handler(){
    setbutton_color('#FFFDE3')
    handleShow()
  }

  const categories_data = async() =>{
    const res = await fetch('/category_data',{
        method:'GET',
        headers:{
            'Content-Type' : 'application/json',
            'x-auth-token' : localStorage.getItem('token'),
        }
    })
    const data = await res.json();
    setcategories(data.categories)
}

useEffect(()=>{
  categories_data()
  dispatch(change_nav_value('Categories'))
},[])

  return (
    <div className={categorycss.main}>
      {
        categories.length==0?
        loading_cards.map((elem,key)=>{
          return(
            <div className={categorycss.loading_card}>
              <Skeleton sx={{'border-radius':'20px'}} variant="rounded" height='100%' width="100%">
              </Skeleton>
            </div>
          )
        })
        :
        categories.map((elem,key)=>{
          return(
            <div className={categorycss.card_wrap}>
              <Link to={`/categories/${elem.category_name}`}  key={key} className={categorycss.card}>
                <img src={elem.category_image} alt="" />
                <div className={categorycss.heading}>{elem.category_name}</div>
              </Link>
            </div>
            
          )
          
        })
      }
        <div className={categorycss.add_item} style={{backgroundColor:`${button_color}`}} onClick={button_handler}>
            <AddIcon fontSize='large'></AddIcon>
      </div>
      {
        show==true?
        <>
                <Item_modal categories ={categories} type='add_item' messages={{second_modal:'Adding Item' , third_modal:'Item Added'}} handle_modal = {handle_modal} ></Item_modal>

        </>
        :
        <></>
      }

        
    </div>
  )
}

export default Categories