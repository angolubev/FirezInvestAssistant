import './NavbarListItem.css';
import { Component } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

class NavbarListItem extends Component {
  constructor(props) {
    super(props);
    console.log('NavbarListItem constructor');
  }

  onClick() {
    console.log('list item clicked');
    this.props.onSelection(this.props);
  }

  onRemove(e) {
    console.log('list item removed');
    e.stopPropagation();
    this.props.onRemove(this.props.id);
  }

  onEdit(e) {
    console.log('list item edit');
    e.stopPropagation();
    this.props.onEdit(this.props);
  }

  isActive() {
    if (this.props.selectedNavbarListItemData) {
      if (this.props.selectedNavbarListItemData.id === this.props.id) {
        return true;
      }
    }
    return false;
  }

  render() {
    console.log('NavbarListitem rendered');
    return (
      <li
        className={`navbar-list-item ${
          this.isActive() ? 'active' : 'inactive'
        }`}
        onClick={this.onClick.bind(this)}
      >
        <span className="navbar-list-item-name">{this.props.title}</span>
        <IconButton
          className={`navbar-list-item-button-wrapper ${
            this.isActive() ? 'button-visible' : 'button-invisible'
          }`}
          onClick={this.onEdit.bind(this)}
        >
          <EditIcon className="navbar-icon" fontSize="large" />
        </IconButton>
        <IconButton
          className={`navbar-list-item-button-wrapper ${
            this.isActive() ? 'button-visible' : 'button-invisible'
          }`}
          onClick={this.onRemove.bind(this)}
        >
          <ClearIcon className="navbar-icon" fontSize="large" />
        </IconButton>
      </li>
    );
  }
}

export default NavbarListItem;
