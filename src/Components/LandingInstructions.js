import React, { Component } from 'react';

class LandingInstructions extends Component {

    render() {
        return (
          <div>
            <p><i>First,</i> download your Facebook data! Go to <a href="https://facebook.com/settings" target="_blank">facebook.com/settings</a> and click "Download a copy of your Facebook data." You should receive a link to download your zip file via email within a few minutes. More information <a href="https://www.facebook.com/help/131112897028467">here</a>.</p>
            <p><i>Unzip.</i></p>
            <p>Find the <i>"html" folder</i> in your download. Then upload the files <i>"security.htm"</i> and <i>"messages.htm"</i> here. They will only be processed here in your browser. This takes a minute or two, wait and don't worry if this page will become unresponsive during file upload.</p>
            <p>Your data <i>won't be stored or sent</i> anywhere but your local browser.</p>
            <br/>
          </div>
        );
    }
}

export default LandingInstructions;
