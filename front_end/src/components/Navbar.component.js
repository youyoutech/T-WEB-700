import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

var FA = require('react-fontawesome');

export default class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: null
        }
        this._logout = this._logout.bind(this);
        this.getProfile();
    }

    _logout () {
        localStorage.removeItem('token');
       // this.props.history.push('/');
        this.setState({profile: null});
    }

    getProfile(){
        console.log(localStorage.getItem("token"))
        if (localStorage.getItem('token') != null)
        axios.get('http://localhost:4000/users/profile', {
            headers: {
                Authorization : localStorage.getItem('token')
            }}).then(res => this.setState({profile: res.data.userInfo}))
        else{


            this.setState({profile: null})
            console.log(this.state.profile);
        }
    }


    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">BitTracker</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">

                        {this.state.profile == null &&
                        <li className="navbar-item">
                            <Link to="/sign-in" className="nav-link">Se connecter <FA name="rocket"/> </Link>
                        </li>}
                        {this.state.profile == null &&
                        <li className="navbar-item" >
                            <Link to="/sign-up" className="nav-link">S'inscrire</Link>
                        </li>}

                        {this.state.profile != null &&
                        <li className="navbar-item">
                            <Link to="/articles" className="nav-link">Articles</Link>
                        </li>
                        }

                        {this.state.profile != null &&
                        <li className="navbar-item">
                            <Link to="/preference" className="nav-link">Favoris</Link>
                        </li>
                        }

                        {this.state.profile != null &&
                        <li className="navbar-item">
                            <Link to="/my-profile" className="nav-link">Hello {this.state.profile.username}</Link>
                        </li>
                        }
                        {this.state.profile != null &&
                        <li className="navbar-item">
                            <div className="nav-link" onClick={this._logout}>
                            Déconnexion
                            </div>
                        </li>
                        }
                    </ul>
                </div>
            </nav>

        );
    }
}