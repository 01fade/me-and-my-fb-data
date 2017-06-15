import React, { Component } from 'react';
import WRLogo from '../style/wr/wr-logo2.png';

class LandingInstructions extends Component {

    render() {
        return (
          <div>
            <p><i>Me And My Facebook Data</i> is a project for the <a href="http://webresidencies-solitude-zkm.com" target="_blank">web residency program</a> <a href="https://schloss-post.com/category/web-residents/blowing-the-whistle/" target="_blank">Blowing the Whistle, Questioning Evidence</a> curated by Tatiana Bazichelli with Solitude and ZKM.</p>
            <br/>
            <p><i>First,</i> download your Facebook data! Note that, right now <i>only English</i> will fully work. You can <a href="https://www.facebook.com/help/327850733950290">change the language</a> Facebook is shown in, before requesting your download!</p>
            <p>Now, go to <a href="https://facebook.com/settings" target="_blank">facebook.com/settings</a> and click on "Download a copy of your Facebook data.", below the settings. You should receive a link to download your zip file via email within a few minutes. More information <a href="https://www.facebook.com/help/131112897028467">here</a>.</p>
            <p><i>Unzip.</i></p>
            <p>Find the <i>"html" folder</i> in your download. Then upload the files <i>"security.htm"</i> and <i>"messages.htm"</i> here. They will only be processed here in your browser. This takes a minute or two, wait and don't worry if this page will become unresponsive during file upload.</p>
            <p>You can watch a <i>demo video</i> <a href="https://vimeo.com/album/4526070/video/218504603">here</a>.</p>
            <p>Your data <i>won't be stored or sent</i> anywhere but your local browser.</p>
            <a target="_blank" href="http://webresidencies-solitude-zkm.com"><img className="wrlogo" src={WRLogo} alt="webresidency-logo"/></a>
            <br/>
          </div>
        );
    }
}

export default LandingInstructions;
