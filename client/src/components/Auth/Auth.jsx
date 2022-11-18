import { useEffect,useState} from 'react';
import {useNavigate,Outlet, useParams} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../Redux/slice'
import Dashboard from '../dashboard/Dashboard'
import Login from '../login/Login';

const Auth = () => {
    const Navigate = useNavigate();
    // reading data from redux store
    const auth_check = useSelector(state => state.isauthorized.value)
    const [trying, settrying] = useState(false)
    const dispatch = useDispatch();


    const private_routes = async() =>{
        const res = await fetch('/verify_route',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
                'x-auth-token':localStorage.getItem('token')
            }
        })
        const data = await res.json();
        
        if(data.status == 201){
            {dispatch(increment())}
        }
        else{
            {dispatch(decrement())}
        }

    }

    // made a use effect here so that whenever this file is invoked through app.js then this function must runs otherwise it will have the default values in it
    useEffect(()=>{
        private_routes()
    })

    return(
        <>
            {
            auth_check==true?
                window.location.pathname=='/'?
                Navigate('/categories')
                :
                <Outlet/>
            :
            <Login/>
            }
        </>
    )
        
}

export default Auth