import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { remove } from "../../Redux/Action_Create/ActionCreate";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

// import { jwtDecode } from "jwt-decode";


const AuthVerification = () => {
    
    const userData=useSelector(detail =>  detail.authentication)

    const navigate=useNavigate()

    const dispatch=useDispatch();

useEffect(()=>{
    if(userData.loginTime){
        if((Number(userData.loginTime)+8*60*60*1000)<Date.now()){
            dispatch(remove())
            notification.warning({
                message:"Please login again",
                description:"You reached the time-limit"
            })
            setTimeout(()=> navigate("/"),1000)
        }
    }
    // eslint-disable-next-line
  },[userData])

    return (
        <></>
    );
};


export default AuthVerification;