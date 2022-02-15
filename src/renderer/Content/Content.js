import './Content.css';
import { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { equityIdsToDelete: new Set() };
    this.columns = [{ field: 'title', headerName: 'Title', editable: true }];
  }

  onSelectionModelChange(newSelectionModel) {
    console.log(newSelectionModel);
    const equityIdsToDelete = new Set(newSelectionModel);
    this.setState({ equityIdsToDelete: equityIdsToDelete });
  }

  isVisible() {
    return this.props.selectedNavbarListItemData ? true : false;
  }

  getTitle() {
    if (this.isVisible()) {
      return this.props.selectedNavbarListItemData.title;
    }
    return '';
  }

  createDataGrid() {
    return this.isVisible() ? (
      <DataGrid
        columns={this.columns}
        rows={this.props.equitiesList}
        checkboxSelection={this.props.deletionMode}
        density="compact"
        onSelectionModelChange={this.onSelectionModelChange.bind(this)}
      />
    ) : null;
  }

  createBackButton() {
    return this.isVisible() && this.props.deletionMode ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.onBack.bind(this)}
      >
        <ArrowBackIcon className="navbar-icon" fontSize="large" />
      </IconButton>
    ) : null;
  }

  createMoreButton() {
    return this.isVisible() &&
      !this.props.deletionMode &&
      this.props.equitiesList.length > 0 ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.onMore.bind(this)}
      >
        <MoreHorizIcon className="navbar-icon" fontSize="large" />
      </IconButton>
    ) : null;
  }

  createAddButton() {
    return this.isVisible() && !this.props.deletionMode ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.props.onAddEquity}
      >
        <AddIcon className="navbar-icon" fontSize="large" />
      </IconButton>
    ) : null;
  }

  createDeleteButton() {
    return this.isVisible() && this.props.deletionMode ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.onDelete.bind(this)}
      >
        <DeleteIcon className="navbar-icon" fontSize="large" />
      </IconButton>
    ) : null;
  }

  onMore() {
    this.props.setContentDeletionMode(true);
  }

  onBack() {
    this.props.setContentDeletionMode(false);
  }

  onDelete() {
    this.props.setContentDeletionMode(false);
    this.props.onDeleteEquities(this.state.equityIdsToDelete);
  }

  render() {
    // TODO: make a separate component for all buttons
    console.log('Content rendered');
    return (
      <div className="content">
        <div className="content-header">
          <div className="content-header-inner">
            <div className="content-header-middle">{this.getTitle()}</div>
          </div>
        </div>
        <div className="content-main">{this.createDataGrid()}</div>
        <div className="content-footer">
          <div className="content-footer-inner">
            {this.createBackButton()}
            {this.createMoreButton()}
            <div className="content-footer-middle" />
            {this.createAddButton()}
            {this.createDeleteButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
