import React, { Component } from 'react';
import WRLogo from '../style/wr/wr-logo.png';

class About extends Component {

    render() {
    return (
      <div className="content" id="about">
        <p><i>Me And My Facebook Data</i> is a project by <a href="http://22-8miles.com" target="_blank">Hang Do Thi Duc</a>.</p>
        <p>It was started in the <a href="http://webresidencies-solitude-zkm.com" target="_blank">web residency program</a> <a href="https://schloss-post.com/category/web-residents/blowing-the-whistle/" target="_blank">Blowing the Whistle, Questioning Evidence</a> curated by Tatiana Bazichelli with Solitude and ZKM in March 2017.</p>
        <p>This is an ongoing <a href="https://schloss-post.com/category/me-and-my-facebook-data/" target="_blank">project</a>. Check back for possibly more analysis and visualizations of your facebook data (e.g. more details on what kind of links you are sharing, what topics you talk about).</p>
        <p>The code with details about what tech I used can be found at <a href="https://github.com/01fade/me-and-my-fb-data" target="_blank">this github repo</a>.</p>
        <p>As of now, only English is fully supported. I am working on adding all features for German. In the meanwhile, you can <a href="https://www.facebook.com/help/327850733950290">change the language</a> Facebook is shown in to english, before requesting your download!</p>
        <p>Give me feedback or report problems at <i>hang[at]22-8miles.com</i>.</p>
        <a target="_blank" href="http://webresidencies-solitude-zkm.com"><img className="wrlogo" src={WRLogo} alt="webresidency-logo"/></a>
      </div>
    );
    }
}

export default About;
