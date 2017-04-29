import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Start extends Component {

  render() {
    const {data} = this.props;
    const user = data.username ? data.username : "facebook user";
    return (
      data.filesUploaded === false ?
      <Redirect to="/" /> :
      <div className="content">
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
        <p>To start over click on "Restart".</p>
      </div>
    );
  }
}

export default Start;
