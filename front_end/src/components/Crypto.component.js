import React, { Component } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import Navbar from './Navbar.component';

const BlockInfo = props => (
    <div>
        <div className="">rank : {props.crypto.rank}</div>
        <div className="">{props.crypto.name} ({props.crypto.symbol})</div>
        <div>{new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.crypto.priceUsd)} -  
        <span style={{color : parseFloat(props.crypto.changePercent24Hr) < 0 ? "red" : "green"}}>
        {parseFloat(props.crypto.changePercent24Hr).toFixed(2)} %</span></div>
        <div>Market cap : {new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.crypto.marketCapUsd)}</div>
        <div>Volume (24Hr) : {new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' }).format(props.crypto.volumeUsd24Hr)}</div>
    </div>
)

export default class CryptoListe extends Component {
    token = "";
    state = {
        crypto: {},
        times: []
    };
    bLoading = true;
    timeout = null;
    id = "";
    chart = null;
    constructor(props) {
        super(props);

        this.state = {
            crypto: {},
            times: []
        }
        this.id = this.props.match.params.id;
        console.log(this.id);
        this.token = localStorage.getItem("token_tweb");
        if (!this.token){
            
        }
        this.getCrypto = this.getCrypto.bind(this);
        this.getCrypto();
        this.selectHourly = this.selectHourly.bind(this);
        this.selectDaily = this.selectDaily.bind(this);
        this.selectMinutes = this.selectMinutes.bind(this);
        
    }

    getCrypto(){
        axios.get("http://localhost:4000/cryptos/" + this.id).then((data) => {
            this.setState({crypto :data.data});
            axios.get("http://localhost:4000/cryptos/" + this.id +"/history/hourly").then((times) => {
                this.setState({times : times.data})
                this.initchart()
                this.bLoading = true;
            });
        })
    }

    selectHourly = () => {
        this.bLoading = false;
            axios.get("http://localhost:4000/cryptos/" + this.id +"/history/hourly").then((times) => {
                this.setState({times : times.data})
                this.initchart()
                this.bLoading = true;
            });
    }

    selectDaily = () => {

        this.bLoading = false;
            axios.get("http://localhost:4000/cryptos/" + this.id +"/history/daily").then((times) => {
                this.setState({times : times.data})
                this.initchart()
                this.bLoading = true;
            });
    }

    selectMinutes = () => {
            this.bLoading = false;
            axios.get("http://localhost:4000/cryptos/" + this.id +"/history/minute").then((times) => {
                this.setState({times : times.data})
                this.initchart()
                this.bLoading = true;
            });
    }

    initchart(){
        var ctx = document.getElementById('myChart');
        let data = []
        let data2 = []
        this.state.times.forEach(el => {
            data.push({x:el.date, y:el.priceUsd})
            data2.push(el.date)
        })
        console.log(data);
        if (this.chart != null)
            this.chart.destroy();
        this.chart = new Chart(ctx, {
            type: "line",
            data: {
                //Bring in datalabels
                labels : data2,
                datasets: [
                    {
                        label: this.id,
                        data: data,
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    }

    displayTable(){
        return <BlockInfo crypto={this.state.crypto}/>
    }

    render(){
        return (
            <div>
                <Navbar />
                {this.displayTable()}
                
                <button onClick={this.selectDaily}>Daily</button>&nbsp;
                <button onClick={this.selectHourly}>Hourly</button>&nbsp;
                <button onClick={this.selectMinutes}>Minute</button>
                <canvas id="myChart" width="20%" height="5px"></canvas>
            </div>
        );
    }
}