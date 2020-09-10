import React, { Component } from "react";
import axios from 'axios';
import Swal from 'sweetalert';

export default class SignUp extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeFirstname = this.onChangeFirstname.bind(this);
        this.onChangeLastname = this.onChangeLastname.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
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

    onChangeFirstname(e) {
        this.setState({
            firstname: e.target.value
        });
    }

    onChangeLastname(e) {
        this.setState({
            lastname: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }

        axios.post('http://localhost:4000/users/register', userData)
        .then(res => {
            if (res.data.error) {
                Swal("Error", res.data.error, "error");
            } else {
                console.log("OK");
                this.props.history.push('/sign-in')
            }
        });
    }




    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.onSubmit}>
                        <h3>Inscription</h3>

                        <div className="row">
                            <div className="form-group col-sm">
                                <label>Nom</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Nom de famille"
                                    value={this.state.lastname}
                                    onChange={this.onChangeLastname} />
                            </div>

                            <div className="form-group col-sm">
                                <label>Prénom(s)</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Prénom(s)"
                                    value={this.state.firstname}
                                    onChange={this.onChangeFirstname} />
                            </div>
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
                            <label>E-mail</label>
                            <input type="email"
                                className="form-control"
                                placeholder="Adresse mail"
                                value={this.state.email}
                                onChange={this.onChangeEmail} />
                        </div>

                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input type="password"
                                className="form-control"
                                placeholder="Mot de passe"
                                value={this.state.password}
                                onChange={this.onChangePassword} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Sauvegarder</button>
                        <p className="forgot-password text-center mt-4">
                            Vous avez déja un compte? <a href="/sign-in">Connectez-vous!</a>
                        </p>
                    </form>
                </div>
            </div>

        );
    }
}

