import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar.component'
import CryptoListe from './CryptoListe.component'

export default class Dashboard extends Component {


    render() {
        return (
            <div>
                <Navbar/>
                <CryptoListe/>
            </div>
        );
    }
}