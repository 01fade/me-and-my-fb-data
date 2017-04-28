import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from 'react-router-dom';
import $ from 'jquery';
import moment from 'moment';
import * as linkify from 'linkifyjs';

import Start from './Pages/Start';
import About from './Pages/About';
import Security from './Pages/Security';
import Activity from './Pages/Activity';
import Messages from './Pages/Messages';
import NoMatch from './Pages/NoMatch';

import LandingInstructions from './Components/LandingInstructions';
import './style/App.css';

class App extends Component {
  constructor() {
      super();
      this.state = {
        dataReady: false
      };
  }

  componentDidMount() {
  }

  saveToLocalStorage(times, links) {
    localStorage.setItem("messagesTimes", JSON.stringify(times));
    localStorage.setItem("messagesContent", JSON.stringify(links));
    localStorage.setItem("username", this.state.username);
  }

  passToNextState(msgTimes, msgContent){
    let links = [];
    if(msgTimes) {
      console.log("messagestimes", msgTimes.length);
      this.setState({messagesTimes: msgTimes});
    }
    if(msgContent) {
      console.log("msgContent", msgContent.length);
      links = linkify.find(msgContent).filter((d)=>{return d.type === "url"; });
      this.setState({messagesContent: links});
    }
    this.saveToLocalStorage(msgTimes, links);
    this.setState({dataReady: true});
  }

  refresh() {
    this.setState({dataReady: false});
    window.location = "/";
  }

  getName(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const username = doc.getElementsByTagName("h1")[0].innerText;
    let status = username ? username : "facebook user";
    status += ", your files are uploading...";
    $("#status").html(status);
    $(".loader").css("display", "inline-block");
    this.setState({username: username});
  }

  processMessages() {
    // takes a while depending on size
    const that = this;
    if (this.state.messages) {
      const html = $(this.state.messages.html);
      let timestamps = [];
      let msgcontent = "";
      const messages = html.find("span.user");
      messages.each(function(i) {
          const el = $(this);
          const msg = el.parent().parent().next("p").text();
          msgcontent += msg + " ";
          const name = el.text();
          const meta = el.next("span.meta").text();
          if (name === that.state.username) {
            const createdTime = meta.substring(meta.indexOf(', ') + 1).replace(" at ", " ");
            const createTimestamp = moment(createdTime, "MMMM D, YYYY h:ma").unix();
            timestamps.push(createTimestamp);
          }
          if (i === messages.length - 1) {
            that.passToNextState(timestamps, msgcontent);
          }
      });
    } else {
      that.passToNextState();
    }
  }

  processFiles(i) {
      let index = i;
      const files = this.files;
      const file = files[index];

      const reader = new FileReader();
      reader.onload = e => {
          const name = files[index].name.replace(".htm", "");
          const obj = {};
          const size = files[index].size;
          obj[name] = { html: reader.result, size: size };
          this.setState(obj);
          console.log(index, name, size);
          if (index === 0) { this.getName(reader.result); };
          if (index < this.filesNum - 1) {
            index++;
            this.processFiles(index);
          } else {
            this.processMessages();
          }
      }
      // reader.onprogress = e => {
        // console.log(e);
      // }
      reader.readAsText(file);
  }

  loadFiles() {
    const fileInput = document.getElementById('fileInput');
    this.files = fileInput.files;
    this.filesNum = this.files.length;
    console.log(this.filesNum, this.files, "loaded");
    if (this.filesNum > 0) {
      this.processFiles(0);
    }
  }

  chooseFiles() {
    this.setState({chosenFiles: true});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div id="progressbar"></div>
          <div className="Nav">
            {this.state.dataReady && <button id="restart-btn" className="btn-active" onClick={this.refresh.bind(this)}>restart</button>}
            <ul className="nav-list">
              <li><NavLink activeClassName="activeNav" to="/about">about</NavLink></li>
              {!this.state.dataReady && <li><NavLink activeClassName="activeNav" exact to="/">start</NavLink></li>}
              {this.state.security && this.state.dataReady && <li><NavLink activeClassName="activeNav" to="/security">security</NavLink></li>}
              {/*this.state.messages && this.state.dataReady && <li><NavLink activeClassName="activeNav" to="/activity">activity</NavLink></li>}
              {this.state.messages && this.state.dataReady && <li><NavLink activeClassName="activeNav" to="/messages">messages</NavLink></li>*/}
            </ul>
          </div>

          <Switch>
            <Route exact path="/" render={()=>
              this.state.dataReady ?
              <Redirect to={"/start"} /> :
              <div className="content">
                <LandingInstructions />
                <div className={this.state.chosenFiles ? "input-container btn-inactive big-btn" : "input-container btn-active big-btn"}>
                    choose files
                    <input type="file" id="fileInput" className="hide-file" multiple  accept=".htm,.html" onChange={this.loadFiles.bind(this)} />
                </div>
                <button id="submit" className={this.state.chosenFiles ? "btn-action big-btn" : "btn-inactive big-btn"} onClick={this.loadFiles.bind(this)}>get analysis</button>
                <div className="status-container"><p><span id="status"></span><span className="loader"></span></p></div>
              </div>
            }/>
            <Route path="/about" component={About}/>
            <Route path="/start" render={()=>
                <Start data={this.state} username={this.state.username}/>}/>
            <Route path="/security" render={()=>
                <Security data={this.state.security} username={this.state.username}/>}/>
            {/* <Route path="/activity" render={()=>
                <Activity data={this.state.messagesTimes} username={this.state.username}/>}/>
            <Route path="/messages" render={()=>
                <Messages data={this.state.messagesContent} username={this.state.username}/>}/> */}
            <Route path="/404" component={NoMatch}/>
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
