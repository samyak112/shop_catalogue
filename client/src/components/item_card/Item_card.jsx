import React, { useEffect, useState } from 'react'
import itemcardcss from '../item_card/item_card.module.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import MobileStepper from '@mui/material/MobileStepper';
import Item_modal from '../item_modal/Item_modal';



function Item_card({data , all_images , index_value}) {
    let final_data = data
    let all_images_data = all_images
    const [index, setindex] = useState(0)
    useEffect(()=>{
      setindex(index_value)
    },[index_value])
    const [current_image, setcurrent_image] = useState(0)
    const [button_color, setbutton_color] = useState('#ECC5FB')
    const [Open, setOpen] = useState(false)
    const [show, setshow] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };

  function handleClose(){
    setOpen(false);
  }

  function change_image(direction,length){
    if(direction=='forward'){
        if(index==length-1){
            setindex(0)
        }
        else{
          setindex(index+1)
        }
    }
    else{
        if(index==0){
          setindex(length-1)
        }
        else{
          setindex(index-1)
        }
    }
  }

  const handle_modal = (value) =>{
    setshow(value)
    setbutton_color('#ECC5FB'); 
  }
  


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

    return(
        <>
        <div className={itemcardcss.card}>
          <div className={itemcardcss.card_description_three_dots}>
                <MoreVertIcon onClick={()=>{setshow(true)}}></MoreVertIcon>
            </div>
          <div className={itemcardcss.card_image} onClick={handleOpen}>
            <img src={final_data.item_image} alt="" />
          </div>
        </div>
        <Modal
          onClose={handleClose}
          open={Open}
          // onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
            <>

            <Box sx={{ ...style, height:'90%', width: '100%', background:'transparent' , border:'none' }}>
            <div className={itemcardcss.close_icon}>
                <CloseIcon onClick={handleClose} fontSize='large'></CloseIcon>
            </div>
            <div className={itemcardcss.main}>
                <div className={itemcardcss.each_image}>
                    <div className={itemcardcss.arrows} id={itemcardcss.left_arrow}><ArrowBackIosIcon onClick={()=>{change_image('backward' , all_images_data.length)}} fontSize='large'></ArrowBackIosIcon></div>
                    <div className={itemcardcss.modal_image}>
                      
                        <img className={itemcardcss.actual_image} src={all_images_data[index].item_image} alt="" />
                        <div className={itemcardcss.stepper}>
                            <MobileStepper
                                variant="dots"
                                steps={all_images_data.length}
                                position="static"
                                activeStep={index}
                                sx={{ maxWidth: 400, flexGrow: 1 , borderRadius:'20px' }}
                                />
                        </div>
                    </div>
                    <div className={itemcardcss.arrows} id={itemcardcss.right_arrow}><ArrowForwardIosIcon onClick={()=>{change_image('forward',all_images_data.length)}} fontSize='large'></ArrowForwardIosIcon></div>
                </div>
                
                   
            </div>
            
            
          </Box>
            </>
          
        </Modal>

        {
        show==true?
        <>
                <Item_modal categories={final_data} messages={{second_modal:'Saving Changes' , third_modal:'Changes Saved' , id:final_data._id}} type = 'edit_item' handle_modal = {handle_modal} ></Item_modal>

        </>
        :
        <></>
      }
        </>
      )
}

export default Item_card