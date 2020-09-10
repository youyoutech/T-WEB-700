import React, { Component } from 'react';
import axios from 'axios';
 
import { Link} from 'react-router-dom';

const Currency = props => (
    <tr>
        <td>{props.cryptos.rank}</td>
        <td><Link to={"/crypto/" + props.cryptos.id}>{props.cryptos.name}</Link></td>
        <td>{new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.cryptos.priceUsd)}</td>
        <td>{new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.cryptos.vwap24Hr)}</td>
        <td>{parseFloat(props.cryptos.changePercent24Hr).toFixed(2)} %</td>
        {props.isAdmin && <td onClick={ ()  => props.addOrRemove(props.cryptos.id, props.cryptosInDb)}>aa</td>}
        {props.isUser && <td onClick={ ()  => props.addPref(props.cryptos.id, props.pref)}>bb</td>}
    </tr>
)


export default class CryptoListe extends Component {
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
        this.onChangeTitle = this.onChangeTitle.bind(this)
        this.getListCrypto = this.getListCrypto.bind(this);
        this.displayTable = this.displayTable.bind(this);
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
                axios.get("https://api.coincap.io/v2/assets").then(data=> 
                    this.setState({cryptosAll : data.data.data}
                    ))
            })
        else{
            this.setState({profile: null})
        }
    }

    getListCrypto(){
        axios.get("http://localhost:4000/cryptos?cmids={"+this.state.q + "}").then((data) => {
            this.setState({cryptos :data.data});
            this.bLoading = true;
        })
        setInterval(() => 
        axios.get("http://localhost:4000/cryptos?cmids={"+this.state.q + "}").then((data) => {
            this.setState({cryptos :data.data});
            this.bLoading = true;
        }), 10000);
    }

    formatList(cryptoss) {
        console.log(cryptoss)
        if (cryptoss)
        return cryptoss.map(currentExercise => {
            return <Currency
                cryptos={currentExercise} 
                isAdmin={this.state.profile && this.state.profile.role == "ADMIN"}
                isUser={this.state.profile && this.state.profile.role == "USER"}
                addPref={this.addPref}
                pref={this.state.profile ? this.state.profile.preferences: null}
                addOrRemove={this.addOrRemove}
                cryptosInDb={this.state.cryptos} />
        })
    }

    addPref(id, pref) {
        console.log(pref)
        if (pref.includes(id)){
            const index = pref.indexOf(id);
            if (index > -1) {
              pref.splice(index, 1);
            }
        }
        else
            pref.push(id)
        let data = {
            preferences : pref
        }
        axios.put("http://localhost:4000/users/preferences", data, {
            headers:{
                authorization : localStorage.getItem('token')
            }
        }).then( (res) => {
            console.log("coucou")
        })
    }
    

    onChangeTitle(e){
        this.setState({ q: e.target.value})
        if (!this.timeout)
        this.timeout = setTimeout(() =>
            axios.get("http://localhost:4000/cryptos?cmids={"+this.state.q + "}").then((data) => {
            this.setState({cryptos :data.data});
            this.bLoading = true;
            this.timeout = null;
        }), 200);

    }


    addOrRemove(id, cryptosInDb){
        let contain = false;
        let data = {
            fullName: id
        }
        console.log(id)
        cryptosInDb.map(element => {
            if (element.id == id){
                contain = true;
                axios.delete("http://localhost:4000/cryptos/"+id, {
                    headers: {
                        token : localStorage.getItem('token')
                    }}).then( res => {});
            }
        });
        if (!contain){
            axios.post("http://localhost:4000/cryptos", data, {
                headers: {
                    token : localStorage.getItem('token')
                }}).then((res) => {

                })
        } 
    }

    displayTable(){
        
        console.log(this.cryptos);
    }

    render(){
        return (
            <div className="app">
            <h3>Currencies </h3>
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
            {this.state.profile?.role == "ADMIN" &&
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
                    { this.formatList(this.state.cryptosAll) }
                </tbody>
            </table>
            }
        </div>
        
        );
    }
}