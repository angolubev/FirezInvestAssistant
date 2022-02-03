import "./Content.css";
import { Component } from "react";

class Content extends Component {
  constructor(props) {
    super(props);
  }

  getTitle() {
    if (this.props.selectedNavbarListItemData) {
      return this.props.selectedNavbarListItemData.title;
    }
    return "";
  }

  render() {
    return (
      <div className="content">
        <div className="content-header">
          <div className="content-header-inner">
            <div className="content-header-middle">{this.getTitle()}</div>
          </div>
        </div>
        <div className="content-main"></div>
        <div className="content-footer"></div>
      </div>
    );
  }
}

export default Content;
