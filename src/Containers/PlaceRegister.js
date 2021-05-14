import * as React from "react";
import { Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import {FirestoreService} from "./firebaseApi";
import {Redirect}  from "react-router-dom";

const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} = require("react-google-maps");

const {
  SearchBox
} = require("react-google-maps/lib/components/places/SearchBox");

function MapView(props) {
  console.log(props);
  return (
    <Container>
        <Row className="align-items-center justify-content-md-center">
            <GoogleMap
              ref={props.mapRef}
              defaultZoom={10}
              center={props.center}
              defaultOptions={{ streetViewControl: false, mapTypeControl: false }}
              onClick={props.onMapClick}
            >
              <SearchBox
                ref={props.searchBoxRef}
                bounds={props.bounds}
                controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Busque pelo local aqui"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`
                  }}
                />
              </SearchBox>
              {props.markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={marker.icon} >
                  <InfoWindow>
                    <React.Fragment>
                      <Row className="align-items-center justify-content-md-center"><Col className="col-sm">Nome:</Col><Col className="col-sm">{marker.name}</Col></Row>
                      <Row className="align-items-center justify-content-md-center"><Col className="col-sm">Endereço:</Col><Col className="col-sm">{marker.formatted_address}</Col></Row>
                      <Row className="align-items-center justify-content-md-center"><Col className="col-sm">Número de Telefone:</Col><Col className="col-sm">{marker.formatted_phone_number}</Col></Row>
                      <Row className="align-items-center justify-content-md-center"><Col className="col-sm">Website:</Col><Col className="col-sm">{marker.website}</Col></Row>
                      <Row className="align-items-center justify-content-md-center"><Col className="col-sm">Tipo:</Col><Col className="col-sm">{marker.types}</Col></Row> 
                      <Row className="align-items-center justify-content-md-center"><Col ><a className="makerLink" target="_blank" href={marker.url}>{marker.name} no google maps</a></Col></Row>
                    </React.Fragment>
                  </InfoWindow>
                </Marker>
              ))}
            </GoogleMap>
          </Row>
          
          
            {props.markers.map((marker, index) => (
            
            <React.Fragment>
              <Container>
                <Form>
                    <Row className="align-items-center justify-content-md-center">
                      <FormGroup>
                        <Col className="col-sm">
                          <a className="makerLink" target="_blank" rel="noopener noreferrer" href={marker.url}>{marker.name} no google maps</a>
                        </Col>
                      </FormGroup>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                        <Col className="col-sm">
                          <FormGroup>
                            <Input
                              id={'name' + props.id}
                              disabled placeholder={marker.name}
                              type="text"

                            />
                          </FormGroup>
                        </Col>
                        <Col className="col-sm">
                          <FormGroup>
                            <Input
                              id="address"
                              disabled placeholder={marker.formatted_address}
                              type="address"
                            />
                          </FormGroup>
                        </Col>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                        <Col className="col-sm">
                          <FormGroup>
                            <Input
                              id="phone"
                              disabled placeholder={marker.formatted_phone_number}
                              type="phone"
                            />
                          </FormGroup>
                        </Col>
                        <Col className="col-sm">
                          <FormGroup>
                            <Input
                              id="type"
                              disabled placeholder={marker.types}
                              type="type"
                            />
                          </FormGroup>
                        </Col>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                      <Col className="col-sm">
                        <FormGroup>
                          <Input
                            id="exampleFormControlTextarea1"
                            placeholder="Considerações sobre o estabelecimento.."
                            rows="1"
                            type="textarea"
                            onChange={e => props.onRegisterChange(e.target.value, "description")}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                      <Col className="col-sm">
                        <FormGroup>
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            className="custom-control-input"
                            id="BTCAccept"
                            type="checkbox"
                            onChange={e => props.onRegisterChange(e, "BTCAccept")}
                          />
                          <label className="custom-control-label" htmlFor="BTCAccept">
                            Esse estabelecimento aceita Bitcoin
                          </label>
                        </div>
                        </FormGroup>
                      </Col>
                      <Col className="col-sm">
                        <FormGroup>
                          <div className="custom-control custom-checkbox mb-3">
                            <input
                              className="custom-control-input"
                              id="LNAccept"
                              type="checkbox"
                              onChange={e => props.onRegisterChange(e.target.value, "LNAccept")}
                            />
                            <label className="custom-control-label" htmlFor="LNAccept">
                              Esse estabelecimento aceita Lightning Network
                            </label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                      <Col >
                        <span className="text-danger">
                          {marker.formStatus}
                        </span>
                          
                      </Col>
                    </Row>
                    <Row className="align-items-center justify-content-md-center">
                      <Col className="col-sm">
                        <Button 
                        block color="primary" 
                        size="lg" 
                        type="button" 
                        onClick={e => 
                        props.RegisterSubmit(e)}
                        >
                          Registrar
                        </Button>
                      </Col>
                    </Row>
                </Form>
              </Container>
            </React.Fragment>
            ))}
    </Container>
  );
}

const DecoratedMapView = withScriptjs(withGoogleMap(MapView));

class PlaceRegister extends React.Component {
  refs = {};

  state = {
    markers: [],
    center: {
      lat: -25.43558687029538,
      lng: -49.27563104109355
    },
    BTCAccept: false,
    LNAccept: false,
    formStatus: "teste",
    formValidate: false,
    description: "",
    isRegistered: false,
    formatted_address: "",
    formatted_phone_number: "",
    latitude: "",
    longitude: "",
    name: "",
    place_id: "",
    types: "",
    url: "",
    website: "",
    redirectToReferrer: false
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.searchBoxRef = React.createRef();
    this.state.userID = props.userID;

  }

  



  onMapMounted = (ref) => {
    this.refs.map = ref;
  };
  onSearchBoxMounted = (ref) => {
    this.refs.searchBox = ref;
  };
  onPlacesChanged = () => {
    const bounds = new window.google.maps.LatLngBounds();
    const places = this.searchBoxRef.current.getPlaces();

    if(places.length > 1 || places[0].types[0] === "locality") {
      this.setState({
        formValidate: false
      });
      return;
    }
    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }


    });
    const nextMarkers = places.map((place) => ({
      position: place.geometry.location,
      icon: place.icon,
      formatted_address: place.formatted_address,
      name: place.name,
      place_id: place.place_id,
      types: place.types[0],
      website: place.website,
      formatted_phone_number: place.formatted_phone_number,
      url: place.url,
      content: place.adr_address
    }));

    const nextCenter =
      nextMarkers[0] && nextMarkers[0].position
        ? nextMarkers[0].position
        : this.state.center;

    console.log(nextMarkers);

    this.setState({
      center: nextCenter,
      markers: nextMarkers
    });
    this.mapRef.current.fitBounds(bounds);


    console.log(bounds);
    this.setState({
      longitude: bounds["La"]["g"],
      latitude: bounds["Ua"]["g"]
    });

    console.log(this.state);

  };
  

  onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    this.setState({ markers: [{ position: { lat, lng } }] });
  };

  onRegisterChange = (value,name) => {
    if(name === "description"){
      this.setState({
        description: value
      });
    }else if(name === "BTCAccept"){
      if(this.state.BTCAccept){
        this.setState({
          BTCAccept: false
        });
      }else{
        this.setState({
          BTCAccept: true
        });
      }

    }else if(name === "LNAccept"){
      if(this.state.LNAccept){
        this.setState({
          LNAccept: false
        });
      }else{
        this.setState({
          LNAccept: true
        });
      }
    }    
  };

  RegisterSubmit = (e) => {
    FirestoreService.getAll().get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().place_id === this.state.markers[0].place_id){
            console.log("É igual");
            this.setState({ 
              isRegistered: true,
            });
            
        }
      });
      console.log(this.state.isRegistered);

      if(!this.state.LNAccept && !this.state.BTCAccept){
        this.setState({ 
          markers: [{ 
            formStatus: 'Selecione ao menos uma das opções (Bitcoin ou Lightning Network).' 
          }] 
        });
        return;
      }else if(this.state.markers[0].types === "country"){
        this.setState({ 
          markers: [{ 
            formStatus: "Seleção inválida. Por favor selecione um local ou serviço." 
          }] 
        });
        return;
      }else if(this.state.isRegistered){
        console.log("entrou");
        this.setState({ 
          markers: [{ 
            formStatus: "Estabelecimento ja cadastrado."
          }] 
        });

        this.setState({ 
          isRegistered: false,
        });

        return;
      }else{
        
        const registerObj =
        {
          formatted_address: this.state.markers[0].formatted_address,
          name: this.state.markers[0].name,
          place_id: this.state.markers[0].place_id,
          types: this.state.markers[0].types,
          website: this.state.markers[0].website,
          formatted_phone_number: this.state.markers[0].formatted_phone_number,
          url: this.state.markers[0].url,
          description: this.state.description,
          LN: this.state.LNAccept,
          BTC: this.state.BTCAccept,
          longitude: this.state.longitude,
          latitude: this.state.latitude,
          userID: this.state.userID
        }

        Object.keys(registerObj).map(function(keyName, keyIndex) {
          //console.log(registerObj[keyName]);
          //console.log(keyName);
          if(typeof registerObj[keyName] === "undefined"){
            registerObj[keyName] = "";
          }
        });

        this.RegisterSubmitFb(registerObj);
  
      }
    });

    return;

    

  };

  RegisterSubmitFb = (data) => {

    console.log(data.place_id);
    FirestoreService.createDoc(data,data.place_id);


    this.setState({ 
      markers: [{
        formatted_address: "",
        name: "",
        place_id: "",
        types: "",
        website: "",
        formatted_phone_number: "",
        url: "",
      }],
      description: "",
      LN: "",
      BTC: "",
      redirectToReferrer: true
    });
      console.log(this.state.redirectToReferrer);
  };
 
 

 
  render() {
    console.log(this.state);
    const { center, markers } = this.state;
    const mapViewProps = {
      googleMapURL:
        "",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `15em` }} />,
      mapElement: <div style={{ height: `100%` }} />
    };

    if (this.state.redirectToReferrer) {
      console.log("REDIRECT");
      return <Redirect to={"/map?latitude="+this.state.latitude+"&longitude="+this.state.longitude} />
    }

    return (
      <DecoratedMapView
        {...mapViewProps}
        center={center}
        markers={markers}
        mapRef={this.mapRef}
        formStatus={this.formStatus}
        searchBoxRef={this.searchBoxRef}
        onPlacesChanged={this.onPlacesChanged}
        onMapClick={this.onMapClick}
        onRegisterChange = {this.onRegisterChange}
        RegisterSubmit = {this.RegisterSubmit}
      />
    );
  }
}

export default PlaceRegister;


/*

import React from "react";
import firebase from 'firebase';
import {FirestoreService} from "./firebaseApi";
import {
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col
  } from "reactstrap";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';


class PlaceRegister extends React.Component {


    getUer = function(){

        var user = firebase.auth().currentUser;
      
        if (user != null) {
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
          });
        }
      
      }





    render(){
        this.getUer();
        return(
            <>
            <Form>
                <FormGroup>
                    <Row className="align-items-center justify-content-md-center">
                        <Col lassName="col-sm">
                            
                                <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                    <i className="ni ni-zoom-split-in" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="Encontre o estabelecimento" type="text" />
                                </InputGroup>
                            
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row className="align-items-center justify-content-md-center">
                        <Col lassName="col-sm">
                            <div className="custom-control custom-radio mb-3">
                                <input
                                    className="custom-control-input"
                                    id="customRadio5"
                                    name="custom-radio-2"
                                    type="radio"
                                />
                                <label className="custom-control-label" htmlFor="customRadio5">
                                    Serviços
                                </label>
                            </div>
                        </Col>
                        <Col lassName="col-sm">
                            <div className="custom-control custom-radio mb-3">
                                <input
                                    className="custom-control-input"
                                    id="customRadio6"
                                    name="custom-radio-2"
                                    type="radio"
                                />
                                <label className="custom-control-label" htmlFor="customRadio6">
                                    Comercio
                                </label>
                            </div>
                        </Col>
                        <Col lassName="col-sm">
                            <div className="custom-control custom-radio mb-3">
                                <input
                                    className="custom-control-input"
                                    id="customRadio7"
                                    name="custom-radio-2"
                                    type="radio"
                                />
                                <label className="custom-control-label" htmlFor="customRadio7">
                                    Alimentação
                                </label>
                            </div>
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
        </>
        );
    }

}

export default PlaceRegister;


*/
