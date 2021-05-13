import React, {Component} from 'react';
import CryptoMaps from '../Containers/CryptoMaps';
import { Container, Row, Col } from "reactstrap";

class Map extends Component{
    

    state={
        lt:"",
        lg:""
    };

    componentWillMount(){
        
        const param = new URLSearchParams(window.location.search);
        let lat = param.get('longitude');
        let lg = param.get('latitude')

        if(lat !== null && lg !== null){
            console.log("entrou");
            this.setState({
                lt: param.get('latitude'),
                lg: param.get('longitude')
            });
        }
    }

    render(){
        console.log(this.state);
        
        return(
            <section className="section section-xl">
                <Container fluid="xl">
                    <Row className="align-items-center justify-content-md-center">
                        <Col className="col-sm">
                            <CryptoMaps longitude={this.state.lg} latitude={this.state.lt}/>
                        </Col>
                    </Row>
                    
                </Container>
            </section>
        );
    }

}

export default Map;