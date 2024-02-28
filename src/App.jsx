import React from 'react';
import Home from './components/Home';
import ToDo from './components/ToDo';
import { Routes, Route, Switch} from 'react-router-dom'

const App = () =>{

    return ( 
        <Routes>     
            <Route path='/'  element={<Home/>}/>     
            <Route path='/todo' element={<ToDo/>}/>     
        </Routes> 
    )
}


export default App;