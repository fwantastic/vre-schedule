import React from "react";
import { Container } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <Container>
          <div>
            I'm a software engineer and ex-VRE rider. I built this just to
            provide a better user experience for VRE riders.
          </div>
          <div>
            This data may go out of date when VRE website changes the layout, so please use this at your own risk.
            Official VRE website: <a href="https://www.vre.org" target="_blank">vre.org</a>
          </div>
        </Container>
      </div>
    );
  }
}

export default Footer;
