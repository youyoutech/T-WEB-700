import React, { Component } from 'react';
import Navbar from './Navbar.component';
import jwt from 'jsonwebtoken';

import axios from 'axios';



export default class MyProfile extends Component {


    constructor(props) {
        super(props);

        this.getProfile();

        this.getProfile = this.getProfile.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeFname = this.onChangeFname.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            lastname: "",
            firstname: "",
            username: "",
            email: "",
            password: '',
            preferences: []
        }
    }

    getProfile(){
        axios.get('http://localhost:4000/users/profile', {
            headers: {
                authorization : localStorage.getItem('token')
            }
        }).then(info => {
            console.log("MY INFO", info);
            let me = info.data.userInfo;
            this.setState({
                lastname: me.lastname,
                firstname: me.firstname,
                email: me.email,
                username: me.username,
                preferences: me.preferences,
                id: me._id != undefined? me._id : me.id}
                )
        }).catch(err => {
            console.log("ERROR", err);
        });

    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeName(e) {
        this.setState({
            lastname: e.target.value
        });
    }

    onChangeFname(e) {
        this.setState({
            firstname: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log(this.state.id)
        const userData = {
            lastname: this.state.lastname,
            firstname: this.state.firstname,
            email: this.state.email,
            username: this.state.username,
            _id: this.state.id,
            password: this.state.password,
            preferences: this.state.preferences
        }
        console.log(userData._id);
        axios.put('http://localhost:4000/users/profile', userData, {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        })
        .then(res => {
            localStorage.setItem("token", res.data.token)
            this.getProfile();
            this.props.history.push('/')
        })
        .catch(err => {
            console.log("ERR", err);
        });
    }

    render(){
        return (
            <div>
                <Navbar/>
                <br />
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={this.onSubmit}>
                            <h3>Modifier mon profil</h3>

                            <div className="form-group">
                                <label>Nom</label>
                                <input type="text"
                                    className="form-control"
                                    value={this.state.lastname}
                                    onChange={this.onChangeName} />
                            </div>

                            <div className="form-group">
                                <label>Prénom(s)</label>
                                <input type="text"
                                    className="form-control"
                                    value={this.state.firstname}
                                    onChange={this.onChangeFname} />
                            </div>

                            <div className="form-group">
                                <label>Nom d'utilisateur</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Nom d'utilisateur"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername} />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email"
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={this.onChangeEmail} />
                            </div>

                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password"
                                    required
                                    className="form-control"
                                    placeholder="Mot de passe"
                                    value={this.state.password}
                                    onChange={this.onChangePassword} />
                            </div>


                            <button type="submit" className="btn btn-primary btn-block">Mettre à jour</button>
                        </form>


                    </div>
                </div>
            </div>
        );
    }
}