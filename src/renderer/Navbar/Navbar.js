import './Navbar.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import { Component } from 'react';
import NavbarListItem from './NavbarListItem/NavbarListItem';

class Navbar extends Component {
  constructor(props) {
    super(props);
    console.log('Navbar constructor');
  }

  onNavbarListItemSelection(id) {
    this.props.onNavbarListItemSelection(id);
  }

  onEditNavbarListItem(navbarListItem) {
    this.props.onEditNavbarListItem(navbarListItem);
  }

  onAddNavbarListItem() {
    this.props.onAddNavbarListItem();
  }

  removeFromNavbarList(id) {
    this.props.removeFromNavbarList(id);
  }

  createNavbarList() {
    console.log(this.props.navbarList);
    return this.props.navbarList.map((currentValue, index, arr) => (
      <NavbarListItem
        key={currentValue.id}
        data={currentValue}
        selectedNavbarListItemId={this.props.selectedNavbarListItemId}
        onSelection={this.onNavbarListItemSelection.bind(this)}
        onRemove={this.removeFromNavbarList.bind(this)}
        onEdit={this.onEditNavbarListItem.bind(this)}
      />
    ));
  }

  render() {
    console.log('Navbar rendered');
    return (
      <div className="navbar">
        <div className="navbar-header" />
        <div className="navbar-content">{this.createNavbarList()}</div>
        <div className="navbar-footer">
          <div className="navbar-footer-inner">
            <IconButton
              className="navbar-footer-button-wrapper"
              onClick={() => console.log('click!')}
            >
              <MoreHorizIcon className="navbar-icon" fontSize="large" />
            </IconButton>
            <div className="navbar-footer-middle" />
            <IconButton
              className="navbar-footer-button-wrapper"
              onClick={this.onAddNavbarListItem.bind(this)}
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
