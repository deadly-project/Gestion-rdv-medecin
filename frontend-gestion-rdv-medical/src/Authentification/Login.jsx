import axios from "axios";
import { useState } from "react";
import {Link} from "react-router-dom"

export default function Login() {
    const [login, setLogin] = useState({
        username:"",
        password:""
    })
    const url = "http://localhost:8080/backend/users"
    const handleClickLogin = async () =>{
    
        try{
            const res = await axios.post(url, login);
            console.log(res.data.username);
        }
        catch(err){
            console.error(err)
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
        </div>
    )
}