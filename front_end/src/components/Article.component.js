import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar.component';



export default class Article extends Component {
    token = "";
    state;
    bLoading = true;
    timeout = null;
    Liste = [];
    id = "";
    constructor(props) {
        super(props);

        this.state = {
            Article: {}
        }

        this.id = this.props.match.params.id;
        this.token = localStorage.getItem("token_tweb");
        if (!this.token){
            
        }
        this.getArticle = this.getArticle.bind(this);
        this.getArticle();
    }

    getArticle(){
        axios.get("http://localhost:4000/articles/" + this.id).then((data) => {
            this.setState({Article :data.data[0]});
            this.bLoading = true;
        })
    }



    displayTable(){
        
        console.log(this.Articles);
    }

    render(){
        return (
            <div>
                <Navbar/>
                <h3>Article</h3>
                <div>{this.state.Article.title}</div>
                <div>{this.state.Article.description}</div>
        </div>
        
        );
    }
}