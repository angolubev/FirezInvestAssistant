import "./Navbar.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import NavbarListItem from "./NavbarListItem/NavbarListItem";
import { Component } from "react";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.onNavbarListItemSelection = this.onNavbarListItemSelection.bind(this);
    console.log("Navbar constructor");
  }

  onNavbarListItemSelection(data) {
    this.props.onNavbarListItemSelection(data);
  }

  render() {
    console.log("Navbar rendered");
    console.log(this.props.selectedNavbarListItemData);
    return (
      <div className="navbar">
        <div className="navbar-header"></div>
        <div className="navbar-content">
          <NavbarListItem
            id={1}
            title="ololo"
            selectedNavbarListItemData={this.props.selectedNavbarListItemData}
            onSelection={this.onNavbarListItemSelection}
          />
          <NavbarListItem
            id={2}
            title="kek"
            selectedNavbarListItemData={this.props.selectedNavbarListItemData}
            onSelection={this.onNavbarListItemSelection}
          />
          <NavbarListItem
            id={3}
            title="1"
            selectedNavbarListItemData={this.props.selectedNavbarListItemData}
            onSelection={this.onNavbarListItemSelection}
          />
          <NavbarListItem
            id={4}
            title="2"
            selectedNavbarListItemData={this.props.selectedNavbarListItemData}
            onSelection={this.onNavbarListItemSelection}
          />
        </div>
        <div className="navbar-footer">
          <div className="navbar-footer-inner">
            <IconButton
              className="navbar-footer-button-wrapper"
              onClick={() => console.log("click!")}
            >
              <MoreHorizIcon className="navbar-icon" fontSize="large" />
            </IconButton>
            <div className="navbar-footer-middle"></div>
            <IconButton
              className="navbar-footer-button-wrapper"
              onClick={() => console.log("click!")}
            >
              <AddIcon className="navbar-icon" fontSize="large" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
