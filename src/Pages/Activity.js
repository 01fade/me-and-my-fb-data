import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TimelineLite } from 'gsap';
import $ from 'jquery';
import _ from 'lodash';
// import moment from 'moment';
import Xaxis from '../Components/Xaxis';

class Activity extends Component {
  constructor() {
    super();
    const local = localStorage.getItem("messagesTimes") !== null ? JSON.parse(localStorage.getItem("messagesTimes")) : "";
    this.state = {
      animationDone: false,
      localData: local
    };
    this.years = {};
  }

  sortNumber(a,b) {
    return a - b;
  }

  componentDidMount() {
    // this.animationTL();
    this.times = this.state.localData === "" ? this.props.data : this.state.localData;
    this.times = this.times.sort(this.sortNumber);
    this.chopToYears();
  }

  chopToYears(){
    for (var i = 0; i < 100; i++) {
      // const key = moment.unix(this.times[i]).year();
      // const obj = {};
      // obj[key] = []
      // console.log();
    }
  }

  componentWillMount() {
  }

  visualize(arr) {
    console.log(arr);
  }

  playTL() {
    this.tl.restart();
  }

  animationTL() {
    this.tl = new TimelineLite({delay: 1});
    const elements = $('.box');
    const progr = $("#progressbar");
    const unit = (window.innerWidth-40)/25;
    const w = 20;
    this.resetProgressbar();
    elements.each((i, el) => {
        this.tl.fromTo(el, 0.5, {
          display: "block",
          width: w,
          height: w,
          left: i * unit + unit/2 - w/2,
          top: 0,
          opacity: 0,
          scale: 2,
          ease: "Power2.easOut",
          backgroundColor: "#00F"
        }, {
          left: i * unit + unit/2 - w/2,
          top: 0,
          opacity: 1,
          scale: 1,
          backgroundColor: "rgba(92, 144, 255, 0.3)"
        }, "-=0.1")
        .to(progr, 0.3, {
          width: (i+1)/elements.length*100 + "%",
          onComplete: () => {
            // if (i === elements.length-1) {
            //   this.setState({animationDone: true});
            // }
          }
        }, "-=0.3");
    })
    // tl.staggerTo("p", 1, {x:200}, 0.5);
  }

  resetProgressbar() {
    $("#progressbar").css("width", 0);
  }

  componentWillUnmount() {
    this.resetProgressbar();
  }

  render() {
    console.log("Activity: ", this.props.data, this.props.username);
    let redirect = false;
    // for dev
    if (this.props.data === undefined && localStorage.getItem("messagesTimes") === null) {
    // // for prod
    // if (this.props.data === undefined) {
      redirect = true;
    }
    return (
      redirect ?
      <Redirect to="/" /> :
      <div className="content">
          <div id="title">
            <p><span>{this.props.username ? this.props.username : "facebook user"}</span></p>
            <p id="processingbar">Test</p>
            {this.state.animationDone && <button className="btn-active" onClick={this.playTL.bind(this)}>Animate again</button>}
          </div>
          <div id="vis">

            <Xaxis />
          </div>
      </div>
    );
  }
}

export default Activity;
