import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import Login from "./components/Login.component"
import Signup from "./components/Signup.component"
import ArticleListe from './components/ArticleListe.component';
import Crypto from './components/Crypto.component';
import Dashboard from './components/Dashboard.component'
import MyProfile from './components/MyProfile.component';
import Article from './components/Article.component';
import Preferences from './components/PreferencesCrypto.component'



function App() {

  return (
    <div className="App">

      <Router>
        <Route path="/" exact component={Dashboard}/>
        <Route path="/sign-in" component={Login}/>
        <Route path="/sign-up" component={Signup}/>
        <Route path="/my-profile" component={MyProfile}/>
        <Route path='/crypto/:id' render={(props) => <Crypto {...props} />} />
        <Route path="/articles" component={ArticleListe}/>
        <Route path="/article/:id" component={Article}/>
        <Route path="/Preference" component={Preferences}/>
      </Router>

    </div>

  );
}

export default App;
