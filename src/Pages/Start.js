import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Start extends Component {

  render() {
    const {data} = this.props;
    const user = data.username ? data.username : "facebook user";
    return (
      data.filesUploaded === false ?
      <Redirect to="/" /> :
      <div className="content" id="start">
        <p>Let's do this, {user}!</p>
        {(data.messages || data.security) &&
          <p>Choose a <i>section from above</i> to explore your data in a different way.</p>
        }
        <p>
        {!data.messages &&
          <span className="warning">You didn't upload "messages.htm". </span>
        }
        {!data.security &&
          <span className="warning">You didn't upload "security.htm".</span>
        }
        </p>
        {data.security &&
          <p>Please note that unfortunately, for the security section you have to disable any ad blocker (and restart/refresh), so that the browser can make a request to get the locations linked to the IP addresses in your data. Find out more about the tech used to do so on <a href="https://github.com/01fade/me-and-my-fb-data">my github repo</a>.</p>
        }
      </div>
    );
  }
}

export default Start;
