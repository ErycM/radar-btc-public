import React,{Component} from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Container, Row, Col } from "reactstrap";
import PlaceRegister from './PlaceRegister';


const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        var user = authResult.user;
        var credential = authResult.credential;
        var isNewUser = authResult.additionalUserInfo.isNewUser;
        var providerId = authResult.additionalUserInfo.providerId;
        var operationType = authResult.operationType;
        // Do something with the returned AuthResult.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.

        
        return true;
      },
      signInFailure: function(error) {
        // Some unrecoverable error occurred during sign-in.
        // Return a promise when error handling is completed and FirebaseUI
        // will reset, clearing any UI. This commonly occurs for error code
        // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
        // occurs. Check below for more details on this.
        // return handleUIError(error);
        console.log(error);
      },
  
    },
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    signInFlow:'popup',
    signInSuccessUrl: '',//Specifying sign in success url can cause double redirect since we are also managing redirect in react-router with local state.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Other config options...
    
  } 




class Dashboard extends Component{

render(){
  return(

  <div>
  {this.props.loading?<p>Carregando..</p>:
  (!this.props.loggedin?
  <React.Fragment>
    <section className="section section-xl">
      <Container className="shape-container  align-items-center py-lg">
        <Row className="align-items-center justify-content-md-center">
          <Col className="col-sm">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </Col>
          <Col className="col-sm">
          <p>Por favor faça o login para visualizar essa pagina.</p>
          </Col>
        </Row>
        </Container>
    </section>
  </React.Fragment>:
  <React.Fragment>
    <section className="section section-sm">
      <Container className="shape-container  align-items-center py-lg">
        <PlaceRegister userID={this.props.userID}/>
      </Container>
    </section>
    
    
  </React.Fragment>
    
    
  )}
  </div>

  );
  }
}
export default Dashboard;