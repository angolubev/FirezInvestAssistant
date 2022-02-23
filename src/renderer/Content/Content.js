import './Content.css';
import { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import FirezEquityView from 'renderer/Model/equity-view';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { equityIdsToDelete: new Set() };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const usdPrice = {
      type: 'number',
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    };

    this.columns = [
      { field: 'ticker', headerName: 'Ticker', width: 60 },
      { field: 'name', headerName: 'Name', width: 200 },
      { field: 'price', headerName: 'Price', width: 90, ...usdPrice },
      {
        field: 'marketCap',
        headerName: 'Capitalisation',
        width: 120,
        ...usdPrice,
      },
      { field: 'trailingPE', headerName: 'P/E', width: 60, type: 'number' },
      {
        field: 'forwardPE',
        headerName: 'Forward PE',
        width: 60,
        type: 'number',
      },
      { field: 'dividendYield', headerName: 'DY', width: 60, type: 'number' },
      { field: 'PS', headerName: 'PS', width: 60, type: 'number' },
      { field: 'recentlyUpdated', headerName: 'Updated', type: 'boolean' },
    ];
  }

  get rows() {
    const equityViews = [];
    this.props.equitiesList.forEach((element) => {
      const view = new FirezEquityView();
      equityViews.push(view.fromEquity(element));
    });
    return equityViews;
  }

  onSelectionModelChange(newSelectionModel) {
    console.log(newSelectionModel);
    const equityIdsToDelete = new Set(newSelectionModel);
    this.setState({ equityIdsToDelete: equityIdsToDelete });
  }

  isVisible() {
    return this.props.selectedNavbarListItemData ? true : false;
  }

  isError() {
    return this.props.errorMessage ? true : false;
  }

  getTitle() {
    if (this.isVisible()) {
      return this.props.selectedNavbarListItemData.title;
    }
    return '';
  }

  createErrorMessage() {
    return this.isVisible() && this.isError() ? (
      <MuiAlert severity="error" onClose={this.onErrorClose.bind(this)} square>
        <AlertTitle>Error</AlertTitle>
        {this.props.errorMessage}
      </MuiAlert>
    ) : null;
  }

  createLoading() {
    return this.isVisible() && this.props.loadingEquities ? (
      <div className="content-progress-container">
        <CircularProgress />
      </div>
    ) : null;
  }

  createDataGrid() {
    return this.isVisible() && !this.props.loadingEquities ? (
      <DataGrid
        columns={this.columns}
        rows={this.rows}
        checkboxSelection={this.props.deletionMode}
        density="compact"
        onSelectionModelChange={this.onSelectionModelChange.bind(this)}
        square
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

  onErrorClose() {
    this.props.onErrorClose();
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
        {this.createErrorMessage()}
        <div className="content-main">
          {this.createLoading()}
          {this.createDataGrid()}
        </div>
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
