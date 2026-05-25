import axios from "axios";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom"

export default function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        username:"",
        password:""
    });
    const [alert, setAlert] = useState("");
    const url = "http://localhost:8080/backend/login"
    // useEffect(() =>{
    //     localStorage.clear();
    // }, [])
    const handleClickLogin = async () =>{
    
        try{
            const res = await axios.post(url, login);
            if(res.data.success){
                const id = res.data.id;
                const role = res.data.role;
                console.log("role" + role + ", id" + id);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("id", id);
                localStorage.setItem("role", role);
                navigate(`/dashboard/${role}/${id}`);
            }else{
                setAlert(res.data.message);
            }
        }
        catch(err){
            console.error(err);
        }
    }
    return(
        <div>
            <h1>LOGIN</h1>
                <label htmlFor="">Username :</label>
                <input type="text" onChange={e=>{setLogin({...login, username:e.target.value})}} />
                <label htmlFor="">Password :</label>
                <input type="Password" onChange={e=>{setLogin({...login, password:e.target.value})}} />
                <button onClick={handleClickLogin}>Se connecter</button>
                <Link to="/register">S'inscrire</Link>
                {alert && <div>{alert}</div>}
                
        </div>
    )
}