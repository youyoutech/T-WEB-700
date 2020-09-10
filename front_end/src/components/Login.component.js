import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import axios from 'axios';
import Swal from 'sweetalert';



export default class Login extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: ''
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    responseFacebook = (response) => {
        if (response.status == "unknown")
            return;
        var fName = ""
        var lName = ""
        var names = response.name.split(" ")
        var length = names.length

        for (var i = 0; i < length - 1; i++) {
            fName += " " + names[i]
        }
        lName = names[length - 1]

        const user = {
            type: "facebook",
            email: response.email,
            familyName: lName,
            givenName: fName.trim(),
            username: response.name,
            password: response.id
        }


        axios.post('http://localhost:4000/users/auth', user)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                this.props.history.push('/')
            })
            .catch(err => {
                console.log("ERROR", err);
            });
    }

    responseGoogle = (response) => {
        const user = {
            type: "google",
            email: response.profileObj.email,
            familyName: response.profileObj.familyName,
            givenName: response.profileObj.givenName,
            username: response.profileObj.givenName + " " + response.profileObj.familyName,
            password: response.profileObj.googleId
        }

        axios.post('http://localhost:4000/users/auth', user)
        .then(res => {
            localStorage.setItem("token", res.data.token);
            this.props.history.push('/')
        })
        .catch(err => {
            console.log("ERROR", err);
        });

    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post('http://localhost:4000/users/login', userData)
        .then(res => {
                if (res.data.error) {
                    Swal("Erreur", res.data.error, "error");
                } else {
                    localStorage.setItem("token", res.data.token);
                    this.props.history.push('/')
                }
        });
    }


    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.onSubmit}>
                        <h3>Connexion</h3>

                        <div className="form-group">
                            <label>Nom d'utilisateur</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Nom d'utilisateur"
                                value={this.state.username}
                                onChange={this.onChangeUsername} />
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


                        <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
                        <p className="forgot-password text-right">
                            <a href="#">Mot de passe</a> oublié?
                    </p>
                    </form>

                    <div className="text-center mt-4">
                        <GoogleLogin
                            clientId="723867411691-8ar5e8rd8eki9ipttoi7kd1hebij9hk1.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                    <div className="text-center mt-4">
                        <FacebookLogin
                            appId="473476473358035"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={this.responseFacebook} />
                    </div>

                    <p className="forgot-password text-center mt-4">
                        Vous êtes nouveau ici? <a href="/sign-up">Inscrivez-vous!</a>
                    </p>


                </div>
            </div>


        )

    }
}
