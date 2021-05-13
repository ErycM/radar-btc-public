import React from "react";
import {FirestoreService} from "./firebaseApi";
// reactstrap components
import { Container, Row, Col, Button, ButtonGroup, Badge  } from "reactstrap";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import ReactDOM from 'react-dom';
import icoBTC from '../Resources/Images/BTC.svg';
import icoLN from '../Resources/Images/LN.svg';


class CryptoMaps extends React.Component {

  constructor(props){
    super(props);
    
    console.log(this.props);
    if((typeof this.props.latitude !== "undefined" && typeof this.props.longitude !== "undefined") && (this.props.latitude !== "" && this.props.longitude !== "")){
      console.log("Encontrou as coordenadas.");
      const lat = parseFloat(props.latitude);
      const lg =  parseFloat(props.longitude);

      this.state = {
        showingInfoWindow: true,
        activeMarker: {},
        selectedPlace: {},
        stores: [],
        defaultLatitude:lat,
        defaultLongitude:lg,
        optionChange:"none"
      }


    }else{
      console.log("Não localizou coordenadas.");
      this.state = {
        showingInfoWindow: true,
        activeMarker: {},
        selectedPlace: {},
        stores: [],
        defaultLatitude:-25.43558687029538,
        defaultLongitude:-49.27563104109355,
        optionChange:""
      }
    }

  }

  async componentDidMount() {
    const response = await fetch('https://geolocation-db.com/json/');
    const data = await response.json();
    this.setState({ ip: data.IPv4 });

  }
  

  FirebaseListData = FirestoreService.getAll().get().then((querySnapshot) => {
    const listStores = [];
    querySnapshot.forEach((doc) => {
         listStores.push(doc.data());
    });

    
    this.setState({
      stores: listStores
    });

    console.log(listStores);

  });

  onMarkerClick = (props, marker, e) =>{
    
    let verified=0;
    console.log(props.placeAcceptUpdate);

    for(var getIp in props.placeAcceptUpdate) {
      //console.log(props.placeAcceptUpdate[getIp]);
      console.log(props.placeAcceptUpdate[getIp]);
      if(props.placeAcceptUpdate[getIp] === "true"){
        verified=verified+1;
        
      }else{
        verified=verified-1;
      }
    }

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      verified: verified
    });

    console.log(verified);

  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });

     
    }
  };

  displayMarkers = () => {
    console.log(this.state);
    return this.state.stores.map((store, index, name) => {
      return <Marker key={index} id={index} position={{
        lat: store.latitude,
        lng: store.longitude
      }}
      onClick={this.onMarkerClick}
      BTC={store.BTC}
      LN={store.LN}
      description={store.description}
      formatted_address={store.formatted_address}
      formatted_phone_number={store.formatted_phone_number}
      types={store.types}
      url={store.url}
      name={store.name}
      place_id={store.place_id}
      placeAcceptUpdate={store.placeAcceptUpdate}
      description={store.description}
      />
    })
  };

  onAcceptChanged = (e) => {
   // this.setState({
   //   optionChange: e.target.value
   // });
    //console.log("##############");
    //console.log(this.state.selectedPlace.name);
    //console.log(e.target.value);
    //console.log(this.state.ip);

    this.setState({
     optionChange: e.target.value
    });


    if(e.target.value !== "none"){
      console.log(this.state.selectedPlace.placeAcceptUpdate);
      const placeAcceptUpdate = this.state.selectedPlace.placeAcceptUpdate;

      placeAcceptUpdate[this.state.ip] = e.target.value;

      FirestoreService.update(this.state.selectedPlace.place_id,
        {
          placeAcceptUpdate
        }
      );
    }
  };

  onInfoWindowOpen = (props, e) =>{
    //console.log(this.state.selectedPlace.name);
    //const button = (<button onClick={e => {console.log(this.state.selectedPlace.name);}}>mapbutton</button>);
    const Select = (
    <select onChange={this.onAcceptChanged}  value={this.state.optionChange}  id={this.state.selectedPlace.place_id}>
      <option  value="none">Verificou esse estabelecimento?</option>
      <option value="true">Verificado e Aceitante</option>
      <option value="false">Verificado e NÃO Aceitante</option>
    </select>
    );
    ReactDOM.render(React.Children.only(Select), document.getElementById("selectAccept"));
  };

  
  
  render() {
    
    return (
      <>        
        <div className="position-relative">
          <section className="section section-xl">
            <Container className="shape-container  align-items-center py-lg" >
                <Row className="align-items-center justify-content-md-center">

                  <Map google={this.props.google}
                      onClick={this.onMapClicked}
                      initialCenter={{
                        lat: this.state.defaultLatitude,
                        lng: this.state.defaultLongitude}}
                        zoom={14}>
                          {this.displayMarkers()}
                          
                    <InfoWindow 
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}
                      onOpen={e => {
                        this.onInfoWindowOpen(this.props, e);
                      }}
                      >
                          <Container>
                            <Row className="align-items-center justify-content-md-center"><Col sm><span className="text-uppercase badge badge-info ">{this.state.selectedPlace.types}</span>  {this.state.selectedPlace.BTC === true ? <img src={icoBTC} id="BTCImg" alt="Aceita bitcoin"/>: null}  {this.state.selectedPlace.LN === true ? <img src={icoLN} id="BTCImg" alt="Aceita bitcoin"/>: null}</Col></Row>
                            <br/>
                            <Row className="align-items-center justify-content-md-center">
                              <Col sm>

                              { this.state.verified > 0 ?
                              <><Badge color="success">Verificado</Badge><span> Este local foi verificado por usuários da plataforma.</span></>:
                              <><Badge color="warning">Atenção</Badge><span> Alguns usuários relataram que esse estabelecimento não é mais aceitante.</span></>
                              }
                              </Col>
                            </Row>
                            <br/>
                            <Row className="align-items-center justify-content-md-center"><Col sm>Nome:</Col><Col sm><strong>{this.state.selectedPlace.name}</strong></Col></Row>
                            <Row className="align-items-center justify-content-md-center"><Col sm>Endereço:</Col><Col sm>{this.state.selectedPlace.formatted_address}</Col></Row>
                            <Row className="align-items-center justify-content-md-center"><Col sm>Número de Telefone:</Col><Col sm>{this.state.selectedPlace.formatted_phone_number}</Col></Row>
                            <Row className="align-items-center justify-content-md-center"><Col sm>Comentário:</Col><Col sm>{this.state.selectedPlace.description}</Col></Row>
                            <Row className="align-items-center justify-content-md-center">
                              <Col sm>
                                <a className="makerLink" target="_blank" rel="noopener noreferrer" href={this.state.selectedPlace.url}>{this.state.selectedPlace.name} no google maps</a>
                              </Col>
                              <Col sm>
                              <div id="selectAccept" />
                              </Col>
                            </Row>
                          </Container>         
                    </InfoWindow>
                  </Map>
                </Row>
            </Container>
          </section>
        </div>
      </>
    );

  }
}


export default GoogleApiWrapper(
  (props) => ({
    apiKey: 'AIzaSyDs3wf0oN2wKaSLu0uE751wtoUW702rcI8',
  }
))(CryptoMaps);


