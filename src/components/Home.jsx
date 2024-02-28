import React from "react";
import { Link } from "react-router-dom";


export const Login = () =>{

    return(
        <div>
      <h1>Bienvenido a To do list </h1>
      <br/>
      <p className="texto">¡Te doy la bienvenida al mundo de la organización simplificada y la productividad sin esfuerzo! Con nuestra aplicación de lista de tareas, 
        ahora puedes mantener el ritmo con tus responsabilidades diarias de una manera fácil y efectiva</p>
        <br/>
        <br/>
        <br/>
      <Link to={"/todo"}>
        <button class="btn btn-outline-dark boto botton-g ">Iniciemos</button>
      </Link>
    </div>
  );
    
}

export default Login