import React, { useEffect,useState } from 'react'
import {useParams} from 'react-router-dom'
import itemcss from '../items/items.module.css'
import sample_image from '../../images/foundation.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';
import Item_card from '../item_card/Item_card';
import { useDispatch } from 'react-redux'
import { change_nav_value } from '../Redux/navbar_slice';
import { useSelector} from 'react-redux'


function Items() {
  const {item} = useParams();
  const dispatch = useDispatch();
  const stock_state_value = useSelector(state => state.change_state.value)
  const [items_empty, setitems_empty] = useState(true)
  const [instock, setinstock] = useState([])
  const [outstock, setoutstock] = useState([])
  const [stock_state, setstock_state] = useState({message:'In Stock' , status:true})
  let loading_cards = [1,2,3]

  const style = {
    position: 'absolute' ,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
  };

  const item_data = async() =>{
    const res = await fetch('/item_data',{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json',
            'x-auth-token' : localStorage.getItem('token'),
        },
        body:JSON.stringify({
          item
      }),
    })
    const data = await res.json();
    let instock_values = []
    let outstock_values = []
    for (let index = 0; index < data.length; index++) {
      if (data == true) {
        setitems_empty(true)
      }
      else{
        setitems_empty(false)
      }

      if(data[index].in_stock == false){
        outstock_values.push(data[index])
      }
      else{
        instock_values.push(data[index])
      }
      
    }
    setinstock(instock_values)
    setoutstock(outstock_values)
}



useEffect(()=>{
  item_data()
  dispatch(change_nav_value(item))
},[stock_state_value])

  function checking(){
    if(stock_state.status==false){
      setstock_state({status:true , message:'In stock'})
    }
    else{
      setstock_state({status:false , message:'Out of stock'})
    }
  }
  

  return (
    <>
    <div className={itemcss.stock_button}>
    <FormGroup>
      <FormControlLabel control={<Switch onClick={checking} defaultChecked />} label={stock_state.message} />
    </FormGroup>
      </div>

    <div className={itemcss.main}>

      {
        instock.length + outstock.length == 0?

        // items_data.length==0?
        loading_cards.map((elem,key)=>{
          return(
            <div className={itemcss.card}>
              <Skeleton sx={{'border-radius':'20px'}} variant="rounded" height='100%' width="100%">
              </Skeleton>
            </div>
          )
        }):
        items_empty==true?
        <>No items here yet</>
        :
        stock_state.status == false?
        outstock.length==0?
        <>No items here yet</>
        :
          outstock.map((elem,key)=>{
              return(
                <>
                  <Item_card key={key} stock_status={stock_state.status} all_images={outstock} data={elem} index_value={key}></Item_card>
                </>
              )
          }):
          instock.length==0?
          <>NO items here yet</>
          :
          instock.map((elem,key)=>{
            return(
              <>
                <Item_card key={key} stock_status={stock_state.status} all_images={instock} data={elem} index_value={key}></Item_card>
              </>
            )
        })
      }
        </div>
    </>
  )
}

export default Items