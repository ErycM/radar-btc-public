import React,{Component} from 'react';
import classes from './Home.module.css';
import {Route,Link, Switch} from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Map from '../Components/Map';
import logo from "../Resources/Images/logo.svg";
import firebaseApi from './firebaseApi';


class Home extends Component{
    
state={
    overlaywidth:0,
    loggedin:null,
    loading:true,
}

openOverlay=()=>{
    this.setState({overlaywidth:100})
}
closeOverlay=()=>{
    this.setState({overlaywidth:0})
}
singOutUser=()=>{
  firebaseApi.auth().signOut().then(()=>{
    // Sign-out successful.
    this.closeOverlay()
  }).catch(function(error) {
    // An error happened.
  })
}
componentWillMount(){
  firebaseApi.auth().onAuthStateChanged((user)  =>{
    if (user) {
    this.setState({loggedin:true,loading:false, userID:user.uid})

    } else {
    this.setState({loggedin:false,loading:false, userID:""})  // No user is signed in.
    }
  }); 
}

render(){
return(
  <React.Fragment>
    <div style={{width:this.state.overlaywidth + '%'}} className={classes.overlay}>

      <span className={classes.closebtn} onClick={this.closeOverlay}>&times;</span>
      <div className={classes.overlaycontent}>
        <ul>
            <li onClick={this.closeOverlay}><Link to="/dashboard">Cadastro de Locais</Link></li>
            <li onClick={this.closeOverlay}><Link to="/map">Mapa</Link></li>
            <li onClick={this.closeOverlay}><Link to="/contact">Contato</Link></li>
            {this.state.loggedin?<li onClick={this.singOutUser}><Link >Deslogar</Link></li>:null}
        </ul>
      </div>
    </div>

    <div className={classes.Container}>
        <div className={classes.navbarcontainer}>
            <div  className={classes.logocol} ><Link to="/"><img src={logo} alt="companay-logo" width="30" height="30" /><span>Radar BTC</span></Link></div>
            <div  className={classes.navlist}>
                <ul>
                    <li><Link to="/dashboard">Cadastro de Locais</Link></li>
                    <li><Link to="/map">Mapa</Link></li>
                    <li><Link to="/contact">Contato</Link></li>
                    {this.state.loggedin?<li onClick={this.singOutUser}><Link >Deslogar</Link></li>:null}
                </ul>
            </div>
            <span className={classes.hamburger} onClick={this.openOverlay}>&#9776;</span>
        </div>
        <div className={classes.contentcontainer}>
        <Switch>
          <Route path='/' exact render={() => <Landing loading={this.state.loading} loggedin={this.state.loggedin} />} />
          <Route path='/dashboard' exact render={() => <Dashboard loading={this.state.loading} loggedin={this.state.loggedin} userID={this.state.userID} />} />
          <Route path='/map' exact render={() => <Map/>} />
        </Switch>
        </div>
    </div>
  </React.Fragment>
  
);
}
}

export default Home;