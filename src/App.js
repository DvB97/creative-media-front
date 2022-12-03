
import './App.css';
import Tareas from './componentes/tareas';
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Tareas></Tareas>}>
        </Route>
      </Routes>
    </BrowserRouter>


  );
}

export default App;
