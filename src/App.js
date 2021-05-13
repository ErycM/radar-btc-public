import React,{Component} from 'react';
// import Landing from './Container/Landing'
import Home from './Containers/Home'
import {BrowserRouter} from 'react-router-dom';
import Footer from './Containers/Footer';

class App extends Component {

render(){
  return (
    
    <BrowserRouter>
      <React.Fragment>
          <Home/>
          <Footer/>
      </React.Fragment>
    </BrowserRouter>
  );

}
}

export default App;
