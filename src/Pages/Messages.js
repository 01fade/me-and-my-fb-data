import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import _ from 'lodash';
import { TimelineLite } from 'gsap';

class Messages extends Component {
  constructor() {
      super();
      const local = localStorage.getItem("messagesContent") !== null ? JSON.parse(localStorage.getItem("messagesContent")) : "";
      this.state = {
          localData: local,
          section: "all",
          sortedLinks: []
      };
  }

  componentDidMount() {
      console.log("Messages: ", this.props.data);
      const links = this.state.localData === "" ? this.props.data : this.state.localData;
      this.processData(links);
      // FIX, add feature later to get image and description of link
      // this.makeReqs(links, 0);
  }

  processData(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
          let parser = document.createElement('a');
          parser.href = data[i].href;
          data[i].host = parser.host;
      }
      this.sourceDataImproved = data;
      const linkOccurances = _.countBy(_.map(data, "host"));
      console.log(linkOccurances);
      let newArray = [];
      for (var key in linkOccurances) {
        newArray.push({
          host: key,
          value: linkOccurances[key]
        })
      }
      newArray = _.sortBy(newArray, "value");
      newArray = _.reverse(newArray);
      this.setState({sortedLinks: newArray});
      console.log(newArray);
      setTimeout(() => {
        $(".loader").hide();
        this.animationTL(newArray);
      }, 2000);
  }

  animationTL(currentData) {
    this.tl = new TimelineLite();
    for (var m = 0; m < currentData.length; m++) {
      const el = $(".bar");
      this.tl.to(el[m], 0.3, {
        width: currentData[m].value
      }, "-=0")
      .to($(el[m]).next(), 0.2, {
        opacity: 1,
        width: "auto"
      })
      .to($(el[m]).next().next(), 0.2, {
        opacity: 1,
        display: "inline-block"
      }, "-=0.1")
      .to($(".plus")[m], 0.2, {
        opacity: 1
      })
    }
    this.tl.timeScale(5);
    this.listener();
  }

  listener(){
    $(".plus").on("click", (e) => {
      console.log(e);
      const id = "#sub-" + e.target.id.replace("top-", "");
      if (e.target.innerText === "+") {
        $(id).show();
        $(e.target).text("-");
      } else {
        $(id).hide();
        $(e.target).text("+");
      }
    });
  }

  makeReqs(href) {
      const url = 'https://api.urlmeta.org/?url=' + href;
      $.getJSON(url).done(function(data, textStatus, jqXHR) {
          console.log("data", data.meta);
      });
  }

  render() {
    const list = this.state.sortedLinks.map((d, i) => {
      const arr = _.filter(this.sourceDataImproved, {host: d.host});
      const sublist = arr.map((c, b) => {
        return <li key={b}><p><a href={c.href}>{c.href}</a></p></li>;
      })
      const top = "top-" + i;
      const sub = "sub-" + i;
      return <li key={i} >
        <div>
          <div className="bar"></div>
          <div className="linkNum">{d.value}</div>
          <p className="host">{d.host} <span id={top} className="plus">+</span></p>
        </div>
        <ul id={sub}>{sublist}</ul>
      </li>;
    });

    let redirect = false;
    if (this.props.data === undefined && localStorage.getItem("messagesContent") === null) {
      redirect = true;
    }
    return (
      redirect ?
      <Redirect to="/" /> :
      <div className="content">
        <div id="title">
            <p><span>{this.props.username ? this.props.username : "facebook user"}</span><span className="loader" style={{display: "inline-block"}}></span></p>
            <p id="processingbar-mes" className="processingbar"></p>
        </div>
        <ul id="links">{list}</ul>
      </div>
    );
  }
}

export default Messages;
