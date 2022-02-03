import "./Navbar.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import NavbarListItem from "./NavbarListItem/NavbarListItem";
import { Component } from "react";

class Navbar extends Component {
  constructor(props) {
    super(props);
    console.log("Navbar constructor");
  }

  onNavbarListItemSelection(data) {
    this.props.onNavbarListItemSelection(data);
  }

  showPopup() {
    this.props.showPopup();
  }

  removeFromNavbarList(id) {
    this.props.removeFromNavbarList(id);
  }

  render() {
    console.log("Navbar rendered");
    return (
      <div className="navbar">
        <div className="navbar-header"></div>
        <div className="navbar-content">
          {
            this.props.navbarList.map(({ id, title }) => (
              <NavbarListItem
                key={id.toString()}
                id={id}
                title={title}
                selectedNavbarListItemData={this.props.selectedNavbarListItemData}
                onSelection={this.onNavbarListItemSelection.bind(this)}
                onRemove={this.removeFromNavbarList.bind(this)}
              />
            ))
          }
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
              onClick={this.showPopup.bind(this)}
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
