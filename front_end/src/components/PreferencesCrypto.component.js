import React, { Component } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import Navbar from './Navbar.component';

const Currency = props => (
    <tr>
        <td>{props.cryptos.rank}</td>
        <td><Link to={"/crypto/" + props.cryptos.id}>{props.cryptos.name}</Link></td>
        <td>{new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.cryptos.priceUsd)}</td>
        <td>{new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.cryptos.vwap24Hr)}</td>
        <td>{parseFloat(props.cryptos.changePercent24Hr).toFixed(2)} %</td>
        {props.isAdmin && <td onClick={ ()  => props.addOrRemove(props.cryptos.id, props.cryptosInDb)}>aa</td>}
    </tr>
)


export default class Preferences extends Component {
    token = "";
    state;
    bLoading = true;
    timeout = null;
    constructor(props) {
        super(props);

        this.state = {
            cryptos: [],
            q: '',
            profile: null,
            qAdmin: '',
            cryptosAll: []
        }

        this.getProfile();
        this.getListCrypto = this.getListCrypto.bind(this);
        this.getListCrypto();
    }


    getProfile(){
        console.log(localStorage.getItem("token"))
        if (localStorage.getItem('token') != null)
        axios.get('http://localhost:4000/users/profile', {
            headers: {
                Authorization : localStorage.getItem('token')
            }}).then(res => {
                this.setState({profile: res.data.userInfo})
                console.log(this.state.profile)
                axios.get("https://api.coincap.io/v2/assets").then(data=> this.setState({cryptosAll : data.data.data}))
            })
        else{
            this.setState({profile: null})
        }
    }

    getListCrypto(){
        axios.get("http://localhost:4000/cryptos/preferences", {headers: {token: localStorage.getItem('token')}}).then((data) => {
            this.setState({cryptos :data.data});
            this.bLoading = true;
        })
        setInterval(() =>
        axios.get("http://localhost:4000/cryptos/preferences", {headers: {token: localStorage.getItem('token')}}).then((data) => {
            this.setState({cryptos :data.data});
            this.bLoading = true;
        }), 10000);
    }

    formatList(cryptoss) {
        if (cryptoss.length)
        return cryptoss.map(currentExercise => {
            return <Currency
                cryptos={currentExercise}
                isAdmin={this.state.profile && this.state.profile.role == "USER"}
                addOrRemove={this.addOrRemove}
                cryptosInDb={this.state.cryptos} />
        })

    }

    


    render(){
        return (

            <div className="app">
            <Navbar/>
            <h3>Preferences</h3>
            <input type="text" name="title" value={this.state.q} onChange={this.onChangeTitle}/>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>vwap24Hr</th>
                        <th>changePercent24Hr</th>
                    </tr>
                </thead>
                <tbody>
                    { this.formatList(this.state.cryptos) }
                </tbody>
            </table>
        </div>
        );
    }
}