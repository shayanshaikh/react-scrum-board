import React from "react";
import Standup from './Standup';


class Standupsend extends React.Component {



  
  render() {
    if (this.props.projectID) {

    return (
      <Standup projectID={this.props.projectID} />
    )
  } else {
    return null
  }
  }
}

export default Standupsend;