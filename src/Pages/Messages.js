import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Messages extends Component {
  componentDidMount() {

  }

  render() {
    console.log("Messages: ", this.props.data);
    let redirect = false;
    // for dev
    if (this.props.data === undefined && localStorage.getItem("messagesContent") === null) {
    // // for prod
    // if (this.props.data === undefined) {
      redirect = true;
    }
    return (
      redirect ?
      <Redirect to="/" /> :
      <div className="content">
          Messages
      </div>
    );
  }
}

export default Messages;
