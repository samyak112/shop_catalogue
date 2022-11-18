import React, { useState } from 'react'
import login_css from '../login/login.module.css'
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';



function Login() {
    const Navigate = useNavigate();
    const [user_values, setuser_values] = useState({username:'',password:''})
    const [alert_box, setalert_box] = React.useState(false);
    const [alert_message, setalert_message] = useState({message:'' , display:'none'});


    const handle_user_values = (e) => {
        const name = e.target.name;
        const value = e.target.value
        setuser_values({...user_values,[name]:value})
      };
    
      const login_req = async(e) => {
        console.log('entered here')
        e.preventDefault();
              const {username,password} = user_values;
    
              const res = await fetch('/signin',{
                  method:'POST',
                  headers:{
                      'Content-Type' : 'application/json',
                  },
                  body:JSON.stringify({
                      username,password
                  }),
                  
              })
    
    
              // to check if data is coming perfectly or not
              const data = await res.json();
              const {message , status} = data
    
              if(status === 442 ){
                console.log(message)
                setalert_message({message:message , display:'block'});
                setalert_box(true)
              }
    
              else if(status === 201){
                localStorage.setItem('token', data.token);
                console.log(message)
                Navigate('/categories')
              }
    
       };


  return (
    <>
    {/* Alert Box */}
    <Box sx={{ width: '100%', height:'50px' ,display:alert_message.display }}>
        <Collapse in={alert_box}>
            <Alert
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setalert_message({...alert_message , display:'none'})
                    setalert_box(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}
            >
            {alert_message.message}
            </Alert>
        </Collapse>
        
        </Box>
    {/*Sign in form here  */}
    <form className={login_css.main} action='' onSubmit={login_req}>
        <div className={login_css.login_box}>
            <div className={login_css.wrapper}>
            <h2 className={login_css.components} id={login_css.item_1}>Welcome Back!</h2>
            <div className={login_css.components} id={login_css.item_2}>We're so excited to see you again</div>
            <div className={`${login_css.components} ${login_css.font_styles} ${login_css.input_labels}`} id={login_css.item_3}>USERNAME</div>
            <div className={`${login_css.components} ${login_css.text_input_fields}`} id={login_css.item_4}>
                <input  onChange={handle_user_values} name='username' value={user_values.email} type="text" required />
            </div>
            <div className={`${login_css.components} ${login_css.font_styles} ${login_css.input_labels}`} id={login_css.item_5}>
               PASSWORD
            </div>
            <div className={`${login_css.components} ${login_css.text_input_fields}`} id={login_css.item_6}>
                <input onChange={handle_user_values} name='password' value={user_values.password} type="password" required />
            </div>
            <div className={`${login_css.components} ${login_css.font_styles}`} id={login_css.item_7}>
                Forgot your password?
            </div>
            <div className={login_css.components} id={login_css.item_8}>
                <button id={login_css.login_button}> Log In</button>
            </div>
        </div>
    </div>
</form>
    </>
  )
}

export default Login