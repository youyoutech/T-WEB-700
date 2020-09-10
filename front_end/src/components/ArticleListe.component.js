import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar.component';

import { Link} from 'react-router-dom';

const Currency = props => (
    <tr>
        <td><img src={props.Articles.thumbnail}></img></td>
        <td><a target="_blank" href={props.Articles.url}>{props.Articles.title}</a></td>
        <td>{props.Articles.coins.map(item => <p  key={item._id}>{item.name}</p>)}</td>
        <td>{props.Articles.description.slice(0, 200)}...</td>
    </tr>
)

export default class ArticleListe extends Component {
    token = "";
    state;
    bLoading = true;
    timeout = null;
    Liste = [];
    constructor(props) {
        super(props);

        this.state = {
            Articles: [],
            q: ''
        }

        this.token = localStorage.getItem("token_tweb");
        if (!this.token){
            
        }
        this.onChangeTitle = this.onChangeTitle.bind(this)
        this.getListArticle = this.getListArticle.bind(this);
        this.displayTable = this.displayTable.bind(this);
        this.getListArticle();
    }

    getListArticle(){
        axios.get("http://localhost:4000/articles").then((data) => {
            this.setState({Articles :data.data});
            this.Liste = data.data;
            this.bLoading = true;
        })
    }

    formatList() {
        return this.state.Articles.map(currentExercise => {
            return (
                <Currency Articles={currentExercise} key={currentExercise._id}/>)
        })
    }
    onChangeTitle(e){

        this.setState({ q: e.target.value})
        let qfiltre = e.target.value;
        let tmp = []
        this.Liste.forEach(article => {
            let contain = false;
            article.coins.forEach(coins => {
                if (coins.name.toLowerCase().includes(qfiltre))
                    contain = true;
            })
            if (contain == true)
                tmp.push(article);
        });
        this.setState({Articles : tmp})
    }


    displayTable(){
        
        console.log(this.Articles);
    }

    render(){
        return (
            <div>
                <Navbar/>
                <h3>Articles </h3>
                <input type="text" name="title" placeholder="Saisissez une crypto" value={this.state.q} onChange={this.onChangeTitle}/>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Currencies</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.formatList() }
                    </tbody>
                </table>
        </div>
        
        );
    }
}