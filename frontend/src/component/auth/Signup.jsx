import React,{useState,useEffect} from 'react'
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate } from 'react-router-dom';

import {Box,Button,TextField,Typography,Paper} from "@mui/material";

import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Signup=()=>{
    const navigate = useNavigate();

    const [email,setEmail]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [loading,setLoading]=useState(false);

     const { setCurrentUser } = useAuth();

    const handleSignup=async(e)=>{
       

        try{

            setLoading(true);
            const res=await axios.post("http://localhost:3000/signup",{
               email: email,
        password: password,
        username: username,

            });

        

            localStorage.setItem("token",res.data.token);
            localStorage.setItem("userId",res.data.userId);
            localStorage.setItem("username",res.data.username);


            setCurrentUser(res.data.userId);
            setLoading(false);
            window.location.href="/";

        }catch(err){
            console.error(err);
            alert("Signup Failed!");
            setLoading(false);
        }
    }

    return(
         <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
             <Typography variant="h4" align="center" gutterBottom> Sign Up </Typography>
             </div>

        <div className="login-box">
          <div className="div">
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button variant="contained" color="primary"
           fullWidth
            className="login-btn" 
            disabled={loading} 
            onClick={handleSignup}
            sx={{
                "&:hover": {
      bgcolor: "#218b3a",
      boxShadow: "none",      
    }, 
    "&:disabled": {
      bgcolor: "#94d3a2",
      color: "#ffffff",
      cursor: "not-allowed",
    },
                 }}>
                    {loading ? "Loading..." : "Sign Up"}

          </Button>
          
        </div>
       
                <div className="pass-box">
                    <p>
                        Already have an account? <Link to="/auth">Login</Link>
                    </p>
                </div>


            </div>
        </div>
    )

}

export default Signup;