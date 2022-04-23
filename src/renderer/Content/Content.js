import './Content.css';
import { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CachedIcon from '@mui/icons-material/Cached';
import { IconButton } from '@mui/material';
import FirezEquityView from 'renderer/Model/equity-view';
import FirezEquity from 'renderer/Model/equity';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equityIdsToDelete: new Set(),
      fieldNamesToNormalize: ['trailingPE', 'forwardPE', 'dividendYield', 'PS'],
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const usdPrice = {
      type: 'number',
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    };

    const multiplicatorFormatter = (params) => {
      if (params.value == FirezEquity.UNDEFINED_VALUE) {
        return '--';
      } else {
        const maxMinAvg = this.fieldNameToMaxMinAverage.get(params.field);
        console.log(maxMinAvg);
        let normalisedValue =
          (params.value - maxMinAvg.min) / (maxMinAvg.max - maxMinAvg.min);
        if (params.field != 'dividendYield') {
          normalisedValue = 1 - normalisedValue;
        }
        if (params.field == 'dividendYield') {
          return (
            (params.value * 100).toFixed(2) +
            '% (' +
            normalisedValue.toFixed(4) +
            ')'
          );
        }
        return (
          params.value.toFixed(3) + ' (' + normalisedValue.toFixed(4) + ')'
        );
      }
    };

    const averageValueGetter = (params) => {
      let sum = 0;
      let isFieldUndefined = false;
      this.state.fieldNamesToNormalize.forEach((fieldName) => {
        if (params.row[fieldName] == FirezEquity.UNDEFINED_VALUE) {
          isFieldUndefined = true;
        }
        const maxMinAvg = this.fieldNameToMaxMinAverage.get(fieldName);
        let normalisedValue =
          (params.row[fieldName] - maxMinAvg.min) /
          (maxMinAvg.max - maxMinAvg.min);
        if (fieldName != 'dividendYield') {
          normalisedValue = 1 - normalisedValue;
        }
        sum += normalisedValue;
      });
      if (isFieldUndefined) {
        return FirezEquity.UNDEFINED_VALUE;
      }
      return (sum / this.state.fieldNamesToNormalize.length).toFixed(3) + '';
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
      {
        field: 'trailingPE',
        headerName: 'P/E',
        width: 120,
        type: 'number',
        valueFormatter: multiplicatorFormatter,
      },
      {
        field: 'forwardPE',
        headerName: 'Forward PE',
        width: 120,
        type: 'number',
        valueFormatter: multiplicatorFormatter,
      },
      {
        field: 'dividendYield',
        headerName: 'DY',
        width: 130,
        type: 'number',
        valueFormatter: multiplicatorFormatter,
      },
      {
        field: 'PS',
        headerName: 'PS',
        width: 120,
        type: 'number',
        valueFormatter: multiplicatorFormatter,
      },
      {
        field: 'average',
        headerName: 'Average',
        width: 80,
        type: 'number',
        valueGetter: averageValueGetter,
        valueFormatter: (params) => {
          if (params.value == FirezEquity.UNDEFINED_VALUE) {
            return '--';
          }
        },
      },
      { field: 'recentlyUpdated', headerName: 'Updated', type: 'boolean' },
    ];
  }

  componentDidMount() {
    this.fieldNameToMaxMinAverage = this.calculateMaxMinAverage(
      this.state.fieldNamesToNormalize
    );
  }

  componentDidUpdate(prevProps) {
    this.fieldNameToMaxMinAverage = this.calculateMaxMinAverage(
      this.state.fieldNamesToNormalize
    );
  }

  get rows() {
    return this.props.equitiesList;
  }

  calculateMaxMinAverage(fieldNames) {
    const fieldNameToMaxMinAverage = new Map();
    fieldNames.forEach((fieldName) => {
      let max = -999999;
      let min = 999999;
      let sum = 0;
      let k = 0;
      this.props.equitiesList.forEach((equity) => {
        if (equity[fieldName] != FirezEquity.UNDEFINED_VALUE) {
          if (equity[fieldName] > max) {
            max = equity[fieldName];
          }
          if (equity[fieldName] < min) {
            min = equity[fieldName];
          }
          sum += equity[fieldName];
          k++;
        }
      });
      fieldNameToMaxMinAverage.set(fieldName, {
        max: max,
        min: min,
        avg: sum / k,
      });
    });
    return fieldNameToMaxMinAverage;
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
        sx={{
          '& .green': {
            color: '#26a671',
          },
          '& .red': {
            color: '#cc3431',
          },
        }}
        getCellClassName={(params) => {
          if (
            params.value == null ||
            params.value == FirezEquity.UNDEFINED_VALUE
          ) {
            return '';
          } else if (this.state.fieldNamesToNormalize.includes(params.field)) {
            const maxMinAvg = this.fieldNameToMaxMinAverage.get(params.field);
            if (params.field != 'dividendYield') {
              return params.value <= maxMinAvg.avg ? 'green' : 'red';
            }
            return params.value >= maxMinAvg.avg ? 'green' : 'red';
          }
        }}
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
    return this.isVisible() &&
      this.props.deletionMode &&
      this.state.equityIdsToDelete.size > 0 ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.onDelete.bind(this)}
      >
        <DeleteIcon className="navbar-icon" fontSize="large" />
      </IconButton>
    ) : null;
  }

  createUpdateButton() {
    return this.isVisible() &&
      this.props.deletionMode &&
      this.state.equityIdsToDelete.size > 0 ? (
      <IconButton
        className="content-footer-button-wrapper"
        onClick={this.onUpdate.bind(this)}
      >
        <CachedIcon className="navbar-icon" fontSize="large" />
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

  onUpdate() {
    this.props.setContentDeletionMode(false);
    this.props.onUpdateEquities(this.state.equityIdsToDelete);
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
            {this.createUpdateButton()}
            {this.createDeleteButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
