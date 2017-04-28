import React, { Component } from 'react';
import WRLogo from '../style/wr/wr-logo.png';

class About extends Component {

    render() {
    return (
      <div className="content">
        <p><i>Me And My Facebook Data</i> is a project by <a href="http://22-8miles.com" target="_blank">Hang Do Thi Duc</a>.</p>
        <p>It was started in the <a href="http://webresidencies-solitude-zkm.com" target="_blank">web residency program</a> <a href="">Blowing the Whistle, Questioning Evidence</a> curated by Tatiana Bazichelli with Solitude and ZKM in March 2017.</p>
        <p>This is an ongoing <a href="https://schloss-post.com/category/me-and-my-facebook-data/" target="_blank">project</a>. Check back for possibly more visualizations of your facebook data.</p>
        <p>If you like to code, you can also check <a href="https://github.com/01fade/me-and-my-fb-data" target="_blank">my github repo</a> for the project.</p>
        <p>You have run in to problems or have a general comment? Email me at <i>hang[at]22-8miles.com</i>.</p>
        <a target="_blank" href="http://webresidencies-solitude-zkm.com"><img id="wrlogo" src={WRLogo} alt="webresidency-logo"/></a>
      </div>
    );
    }
}

export default About;
