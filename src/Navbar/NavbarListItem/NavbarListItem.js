import "./NavbarListItem.css";
import { Component } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

class NavbarListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isSelected: false, title: props.title, id: props.id };
    console.log("NavbarListItem constructor");
  }

  onClick() {
    console.log("list item clicked");
    this.props.onSelection(this.state);
  }

  onRemove(e) {
    console.log("list item removed");
    e.stopPropagation();
    this.props.onRemove(this.state.id);
  }

  isActive() {
    if (this.props.selectedNavbarListItemData) {
      if (this.props.selectedNavbarListItemData.id === this.state.id) {
        return true;
      }
    }
    return false;
  }

  render() {
    console.log("NavbarListitem rendered");
    return (
      <li
        className={
          "navbar-list-item " + (this.isActive() ? "active" : "inactive")
        }
        onClick={this.onClick.bind(this)}
      >
        <span className="navbar-list-item-name">{this.props.title}</span>
        <IconButton
          className={
            "navbar-list-item-button-wrapper " +
            (this.isActive() ? "button-visible" : "button-invisible")
          }
          onClick={this.onRemove.bind(this)}
        >
          <ClearIcon className="navbar-icon" fontSize="large" />
        </IconButton>
      </li>
    );
  }
}

export default NavbarListItem;
