import React ,{useEffect}from "react";
import {useNavigate,useRoutes} from "react-router-dom";


//Pages List -------->

import Dashboard from "./component/dashboard/Dashboard.jsx";
import Profile from "./component/user/Profile.jsx";
import Login from "./component/auth/Login.jsx";
import Signup from "./component/auth/Signup.jsx";
import { useLocation } from "react-router-dom";
import CreateRepository from "./component/repository/CreateRepository";
//Auth Context--->
import {useAuth} from "./authContext.jsx"

const ProjectRoutes=()=>{
    const location = useLocation();
    const {currentUser,setCurrentUser}=useAuth();
    const navigate=useNavigate();

    useEffect(()=>{
        const userIdFromStorage=localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }
        if(!userIdFromStorage && !["/auth","/signup"].includes(location.pathname)){
            navigate("/auth");
        }
        if(userIdFromStorage && location.pathname=='/auth'){
            navigate("/");
        }

    },[currentUser,navigate,setCurrentUser,location.pathname]);

    let element=useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
    path:"/create",
    element:<CreateRepository/>
}
        
    ]);
    return element;
}

export default ProjectRoutes;