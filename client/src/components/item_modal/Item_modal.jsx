import React, { useEffect, useState } from 'react'
import item_modalcss from '../item_modal/item_modal.module.css'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from 'react-bootstrap/Modal';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from '@mui/icons-material/Cancel';
import uploadFileToBlob from '../azure-storage-blob.ts';
import loading from '../../images/loading.gif'
import done from '../../images/done.gif'
import { useDispatch } from 'react-redux'
import { change_stock } from '../Redux/update_stock_state';

function Item_modal({categories , handle_modal ,type , messages}) {
  console.log(type)
    let category_data = categories
    const dispatch = useDispatch();
    const [item_images, setitem_images] = useState([])
    const [item_images_preview, setitem_images_preview] = useState([])
    const [show, setShow] = useState(false);
    const [current_modal, setcurrent_modal] = useState(1)
    const [item_info, setitem_info] = useState({category_name:''})
    const [instock, setinstock] = useState('In Stock')

    useEffect(()=>{
        if(type=='edit_item'){
            setitem_info({...item_info , item_name:category_data.item_name})
        }
    },[type])
    
    

    const handleClose = () => {
        handle_modal(false)
        setitem_images_preview([]);
        setitem_images([]);
        setitem_info({category_name:'' , item_name:''})
        setcurrent_modal(1)
        };

    const handleChange = (e) => {
        const name= e.target.name;
        const value = e.target.value
        console.log(name, value)
        setitem_info({...item_info , [name]:value});
        };

    const save_images = (e)=>{
        let file_path = e.target.files
        console.log(file_path[1])

        let item_images_preview_2 = []
        let item_images_2 = []

        for (let index = 0; index < file_path.length; index++) {
          console.log(index)
          if(file_path!=undefined){
            item_images_preview_2.push(URL.createObjectURL(file_path[index]))
            item_images_2.push(file_path[index])
        }
        }
        setitem_images_preview(item_images_preview_2)
        setitem_images(item_images_2)
        
    }


    function remove_image(index){
        let image_preview = [...item_images_preview]
        image_preview.splice(index, 1);
    
        let images = [...item_images]
        images.splice(index, 1);
    
        setitem_images_preview(image_preview)
        setitem_images(images)
    }

    const update_item = async()=>{
      console.log(messages)

      let instock_final_value = true

      if(instock == 'In Stock'){
          instock_final_value = true
      }

      else{
        instock_final_value = false
      }

      const res = await fetch('/update_item',{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json',
            'x-auth-token' : localStorage.getItem('token'),
        },
        body:JSON.stringify({
          item_id:messages.id , instock_value:instock_final_value 
        }),
    })
    const data = await res.json();
    if(data.status==202){
      setcurrent_modal(3)
      dispatch(change_stock())
    }
  }

    

    const save_item = async() =>{

        let image_urls = []
        for (let i = 0; i < item_images.length; i++) {
          const file_url = await uploadFileToBlob(item_images[i]);
          image_urls.push(file_url)
        }
        console.log(localStorage.getItem('token'),'this is jwt')
        
        const res = await fetch('/save_item',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
                'x-auth-token' : localStorage.getItem('token'),
            },
            body:JSON.stringify({
              item_info:item_info , image_urls:image_urls
          }),
        })
        const data = await res.json();
        if(data.status==202){
          setcurrent_modal(3)
        }
      }

      function change_current_modal(){
        setcurrent_modal(2)
      }

  return (
    
    <div>
    <Modal className={item_modalcss.modal}
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        >
        {
            current_modal==1?
            <>
            <div className={item_modalcss.modal_main_wrap}>
          <div className={item_modalcss.modal_main}>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_1}>Add new item</div>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_2}>Select Category</div>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_3}>
                {
                    type=='add_item'?
                    <Box sx={{ minWidth: 120}}>
                  <FormControl size='small' fullWidth>
                    <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={item_info.category_name}
                      label="Categories"
                      name='category_name'
                      onChange={handleChange}
                      >
                      {
                          category_data.map((elem,index)=>{
                              return(
                                  <MenuItem key={index} value={elem.category_name}  className={item_modalcss.dropdown_color}>{elem.category_name}</MenuItem>
                                  )
                                })        
                            }
                    </Select>
                  </FormControl>
                </Box>
                :
                <Box sx={{ minWidth: 120}}>
                <FormControl size='small' fullWidth>
                <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={instock}
                    label="Categories"
                    name='category_name'
                    onChange={(e)=>{setinstock(e.target.value)}}
                    >
                    
                    <MenuItem  value={'In Stock'}  className={item_modalcss.dropdown_color}>In Stock</MenuItem>
                    <MenuItem  value={'Out of Stock'}  className={item_modalcss.dropdown_color}>Out of Stock</MenuItem>
                                
                </Select>
                </FormControl>
                </Box>

                }
                
            </div>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_6}>
                    {
                        item_images_preview.length==0?
                        <div className={item_modalcss.added_images} style={{display:'none'}}></div>
                        :
                        item_images_preview.map((elem,index)=>{
                            return(
                                <div key={index} className={item_modalcss.added_images}>
                                <img src={elem} className={item_modalcss.modal_images} alt="item image"/>
                                <div className={item_modalcss.image_cross}>
                                  <CancelIcon fontSize='small' onClick={()=>{remove_image(index)}}></CancelIcon>
                                </div>
                              </div>
                          )
                        })
                    }
            </div>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_7}>
            {
              type=='add_item'?
              <div className={item_modalcss.add_image_button}>
              <label htmlFor='add_image'>
                <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                Add image
              </label>
              <input type="file" name="photo" id='add_image' onChange={save_images} multiple='multiple' hidden />
                
              </div>:
              <></>
            }
              
            </div>
            <div className={item_modalcss.modal_components} id={item_modalcss.modal_item_8}>
              <div className={item_modalcss.modal_final_buttons} id={item_modalcss.cancel_button} onClick={handleClose}>Cancel</div>
              {
                type=='add_item'?
                <div className={item_modalcss.modal_final_buttons} id={item_modalcss.save_button} onClick={()=>{change_current_modal(); save_item()}}>Add item</div>
                :
                <div className={item_modalcss.modal_final_buttons} id={item_modalcss.save_button} onClick={()=>{change_current_modal(); update_item()}}>Update item</div>

              }
            </div>
          </div>
            </div>
          </>
          :
          current_modal==2?
          <>
            <div className={item_modalcss.loading_screen}>
              <img src={loading} alt="" />
              <div className={item_modalcss.loading_text}>{messages.second_modal} please wait</div>
            </div>
          </>
          :
          <>
            <div className={item_modalcss.done}>
              <img src={done} alt="" />
              <div>{messages.third_modal}</div>
              <div className={item_modalcss.close}  onClick={handleClose}>Close</div>
            </div>
          </>
          
        }
       
      </Modal>
        </div>
  )
}

export default Item_modal