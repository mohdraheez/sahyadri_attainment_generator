import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home'
import Assignment from './assignment';
import Uni from './uni';
import Feedback from './feedback';
import Header from './header';
import Navbar from './navbar';
import Overall from './overall';
import Footer from './footer';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home />
        }>
        </Route>
        <Route path='/assignment' element={<Assignment />}>

        </Route>
        <Route path='/uni' element={<Uni />}>

        </Route>
        <Route path='/feedback' element={<Feedback />}>

        </Route>
        <Route path='/Overall' element={<Overall />}>

        </Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
