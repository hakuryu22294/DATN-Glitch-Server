import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
    const naviagate  = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            naviagate('/')
        },1000)
    },[])
    return (
        <div>
        <h1>Bấm bạy cút về home</h1>
        </div>
    );
};

export default NotFound;