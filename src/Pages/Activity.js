import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { TimelineLite } from 'gsap';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import Xaxis from '../Components/Xaxis';
import Grid from '../Components/Grid';

class Activity extends Component {
  constructor() {
      super();
      const local = localStorage.getItem("messagesTimes") !== null ? JSON.parse(localStorage.getItem("messagesTimes")) : "";
      this.daysWritten = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      this.state = {
          localData: local,
          section: "all",
          allYears: {
              years: ["all"],
              all: []
          }
      };
  }

  getEmptyWeekDaily() {
    let arr = [];
    for (var i = 0; i < 7; i++) {
        arr[i] = [];
        for (var k = 0; k < 24; k++) {
            arr[i][k] = {value:0, hour:k, day:i};
        }
    }
    console.log(arr);
    return arr;
}


  sortNumber(a,b) {
    return a - b;
  }

  componentDidMount() {
    console.log("Activity: ", this.props.data);
    let times = this.state.localData === "" ? this.props.data : this.state.localData;
    times = times.sort(this.sortNumber);
    this.chopToYears(times);
  }

  chopToYears(times){
    let yearsCopy = this.state.allYears;
    this.weekdaily = this.getEmptyWeekDaily();
    for (var i = 0; i < times.length; i++) {
      const thisMom = moment.unix(times[i]);
      const key = thisMom.year();
      const day = thisMom.day();
      const hour = thisMom.hour();
      const obj = {
        day: day,
        year: key,
        hour: hour
      };
      // add to diff arrays
      yearsCopy.all.push(obj);

      this.weekdaily[day][hour].value += 1;

      if (typeof yearsCopy[key] === "undefined") {
        yearsCopy[key] = [obj];
        yearsCopy.years.push(key);
      } else {
        yearsCopy[key].push(obj);
      }
      // loop done
      if (i === times.length-1) {
        console.log(this.state.allYears);
        this.setState({
          yearsLoaded: true,
          allYears: yearsCopy
        });
        this.prepareForAnim("all");
      }
    }
  }

  componentWillMount() {
  }

  visualize(arr) {
    console.log(arr);
  }

  prepareForAnim(section) {
    // preparing data
    const unit = (window.innerWidth-40-120-100)/25; //see css for calc
    $("#labels div").css("height", unit);
    let currentData = [];
    if (section !== "all") {
      const startData = this.state.allYears[section];
      let newData = [];
      for (var i = 0; i < 7; i++) {
        const key = "weekdailyByYear" + section;
        const obj = {};
        obj[key] = _.filter(startData, {day: i});
        const activeHoursOfDay = _.map(obj[key], "hour");
        const countActivityInHours = _.countBy(activeHoursOfDay);
        for (var k = 0; k < 24; k++) {
          const v = countActivityInHours[k] ? countActivityInHours[k] : 0;
          newData.push({
              day: i,
              hour: k,
              value: v
          });
        }
      }
      currentData = _.sortBy(_.flattenDeep(newData), "value");
    } else {
      currentData = _.sortBy(_.flattenDeep(this.weekdaily), "value");
    }

    var max = _.map(currentData, 'value')[currentData.length-1];

    this.setState({
      legend0: 0,
      legend1: max + " msg/hr"
    })
    this.animationTL(currentData, max, unit, section);
  }

  animationTL(currentData, max, unit, section) {
    let sum = 0;
    this.tl = new TimelineLite({delay: 1, onUpdate: this.changeProgressbar.bind(this), onComplete: () => {
      const time = section === "all" ? "all time" : section;
      $("#msgNum").html(sum + " total messages of " + time);
    }});
    console.log(currentData);
    for (var m = 0; m < currentData.length; m++) {
      const el = $("#" + currentData[m].day + "-" + currentData[m].hour);
      const val = currentData[m].value;
      let brightness = val/max;
      this.tl.fromTo(el, 0.3, {
        display: "block",
        height: unit,
        opacity: 0,
        scale: 3,
        ease: "Power4.easOut",
        backgroundColor: "#00F",
      }, {
        opacity: 1,
        scale: 1,
        backgroundColor: "rgba(66, 114, 255, " + brightness + ")",
        onStart: () => {
          sum += val;
          $("#msgNum").html(sum + " total");
        }
      }, "-=0.1")
      .to(el, 0.1, {
        border: "1px solid #000"
      });
    }
    this.tl.timeScale(10);
  }

  changeProgressbar() {
    // $("#progressbar").css("width", this.tl.progress() * 100 + "%");
  }

  changeSection(e) {
    const id = $(e.target).text();
    this.tl.stop();
    this.tl.clear();
    $(".gridBox").css("opacity", 0);
    this.prepareForAnim(id);
    this.setState({section:id});
    $("li").removeClass("active");
    $("#" + id).addClass("active");
  }

  render() {
    const list = this.state.allYears.years.map((d, i) => {
      const classN = i === 0 ? "active activeCursor" : "activeCursor";
      return <li key={i} id={d} className={classN} onClick={this.changeSection.bind(this)}><p>{d}</p></li>
    });

    let redirect = false;
    if (this.props.data === undefined && localStorage.getItem("messagesTimes") === null) {
      redirect = true;
    }
    return (
      redirect ?
      <Redirect to="/" /> :
      <div className="content">
          <div id="title">
            <p><span>{this.props.username ? this.props.username : "facebook user"}</span></p>
            <ul>
              {this.state.yearsLoaded && list }
            </ul>
            <p id="processingbar-act" className="processingbar"></p>
          </div>
          <div id="vis">
            <div id="legend">
              <p className="legend" id="legend0">{this.state.legend0}</p><div className="gradient"></div><p className="legend" id="legend1">{this.state.legend1}*</p>
            </div>
            <p id="msgNum"></p>
            <Grid />
            <div id="labels">
              <div>Monday</div>
              <div>Tuesday</div>
              <div>Wednesday</div>
              <div>Thursday</div>
              <div>Friday</div>
              <div>Saturday</div>
              <div>Sunday</div>
            </div>
            <Xaxis />
            <p className="explanation">*{this.state.legend1} indicates the number of messages you sent over the course of the given time period, <br/>e.g. you always reply to messages on sunday evening</p>
          </div>
      </div>
    );
  }
}

export default Activity;
