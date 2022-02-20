import './App.css';
import { Component } from 'react';
import Navbar from './Navbar/Navbar';
import Content from './Content/Content';
import Popup from './Popup/Popup';
import FirezFirebase from './Firebase/firebase';
import FirezYahooConnector from './API/yahoo';
import FirezEquity from './Model/equity';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNavbarListItemId: null,
      showPopup: false,
      popupAction: '',
      navbarList: [],
      equitiesList: [],
      contentDeletionMode: false,
    };

    this.firezfirebase = new FirezFirebase();
    this.firezYahooConnector = new FirezYahooConnector(
      'l3qwKprfEf8kpp1kSGBDq9MFDBlcgY0WTWj20uGb'
    );

    console.log('App constructor');
  }

  componentDidMount() {
    console.log('App componentDidMount()');
    this.firezfirebase.navbarListHandler.onListChange(
      this.updateNavbarList.bind(this)
    );
    this.firezfirebase.navbarListHandler.onListItemChange(
      this.updateNavbarListItem.bind(this)
    );
    this.firezfirebase.equitiesListHandler.onListChange(
      this.updateEquitiesList.bind(this)
    );
  }

  setContentDeletionMode(val) {
    this.setState({
      contentDeletionMode: val,
    });
  }

  getSelectedNavbarListItem() {
    if (!this.state.selectedNavbarListItemId) return null;
    return this.state.navbarList.find(
      (item) => item.id == this.state.selectedNavbarListItemId
    );
  }

  getEquitiesForSelectedNavbarListItem() {
    console.log('getEquitiesForSelectedNavbarListItem()');
    console.log(this.state.equitiesList);
    const selectedNavbarListItem = this.getSelectedNavbarListItem();
    if (!selectedNavbarListItem || !selectedNavbarListItem.tickersList) {
      console.log('no data');
      return [];
    }
    console.log(selectedNavbarListItem.tickersList);
    return this.state.equitiesList.filter((equity) => {
      return selectedNavbarListItem.tickersList.some(
        (ticker) => equity.ticker == ticker
      );
    });
  }

  getEquityByTicker(ticker) {
    return this.state.equitiesList.find((item) => item.ticker == ticker);
  }

  updateNavbarList(newList) {
    this.setState({ navbarList: newList });
  }

  updateEquitiesList(newList) {
    newList.forEach((element, index, array) => {
      const equity = new FirezEquity();
      array[index] = equity.fromObject(element);
    });
    this.setState({ equitiesList: newList });
  }

  updateNavbarListItem(navbarListItem) {
    let navbarList = this.state.navbarList;
    navbarList[this.getSelectedNavbarListItem().index] = navbarListItem;
    this.updateNavbarList(navbarList);
  }

  removeNavbarListItemSelection() {
    this.setState({
      selectedNavbarListItemId: null,
    });
  }

  onNavbarListItemSelection(id) {
    this.setState({ selectedNavbarListItemId: id, contentDeletionMode: false });
  }

  onAddNavbarListItem() {
    this.popupShow('addNavbarListItem');
  }

  onAddEquity() {
    this.popupShow('addEquity');
  }

  getEquityFromYahooByTicker(ticker, callback) {
    this.firezYahooConnector
      .getQuoteByTicker(ticker)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        callback(result.quoteResponse.result[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  upsertEquity(ticker) {
    const response = this.getEquityByTicker(ticker);
    if (!response) {
      console.log('adding equity to firebase');
      this.getEquityFromYahooByTicker(ticker, (equityFromYahoo) => 
        {
          const newEquity = new FirezEquity();
          newEquity.fromYahoo(equityFromYahoo, null);
          this.firezfirebase.equitiesListHandler.insertListItem(newEquity)
        }
      );
    } else {
      const oldEquity = new FirezEquity();
      oldEquity.fromObject(response);
      console.log(oldEquity);
      if (oldEquity.needsUpdate) {
        console.log('updating equity');
        this.getEquityFromYahooByTicker(ticker, (equityFromYahoo) => {
          const newEquity = new FirezEquity();
          newEquity.fromYahoo(equityFromYahoo, oldEquity.id);
          this.firezfirebase.equitiesListHandler.updateListItem(newEquity);
        });
      }
    }

    console.log(this.state.navbarList);
    const selectedNavbarListItem = this.getSelectedNavbarListItem();
    let tickersList = selectedNavbarListItem.tickersList;
    if (!tickersList) {
      tickersList = new Set([ticker]);
    } else {
      tickersList = new Set(tickersList);
      tickersList.add(ticker);
    }
    this.firezfirebase.navbarListHandler.updateListItem({
      title: selectedNavbarListItem.title,
      id: selectedNavbarListItem.id,
      tickersList: Array.from(tickersList),
    });
  }

  removeFromNavbarList(id) {
    this.removeNavbarListItemSelection();
    this.firezfirebase.navbarListHandler.removeListItem(id);
  }

  removeEquitiesFromNavbarListItem(equityIds) {
    const selectedNavbarListItem = this.getSelectedNavbarListItem();
    let tickersList = selectedNavbarListItem.tickersList;
    const tickersToRemove = new Set();
    this.state.equitiesList.forEach((element, index, array) => {
      if (equityIds.has(element.id)) {
        tickersToRemove.add(element.ticker);
      }
    });
    tickersList = tickersList.filter((ticker) => {
      return !tickersToRemove.has(ticker);
    });
    this.firezfirebase.navbarListHandler.updateListItem({
      title: selectedNavbarListItem.title,
      id: selectedNavbarListItem.id,
      tickersList: tickersList,
    });
  }

  onEditNavbarListItem(navbarListItem) {
    this.setState({
      navbarListItemToEdit: navbarListItem,
    });
    this.popupShow('editNavbarListItem');
  }

  popupShow(action) {
    this.setState({
      showPopup: true,
      popupAction: action,
    });
    if (action == 'addNavbarListItem') {
      this.removeNavbarListItemSelection();
    }
    console.log('popupShow');
  }

  onPopupSave(textValue) {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupSave');
    console.log(textValue);
    if (this.state.popupAction == 'editNavbarListItem') {
      this.firezfirebase.navbarListHandler.updateListItem({
        id: this.state.navbarListItemToEdit.id,
        tickersList: this.state.navbarListItemToEdit.tickersList,
        title: textValue,
      });
    } else if (this.state.popupAction == 'addNavbarListItem') {
      this.firezfirebase.navbarListHandler.insertListItem({
        id: false,
        title: textValue,
        tickersList: false,
      });
    } else if (this.state.popupAction == 'addEquity') {
      this.upsertEquity(textValue);
    }
  }

  onPopupCancel() {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupCancel');
  }

  createPopup() {
    const textValue =
      this.state.popupAction == 'editNavbarListItem'
        ? this.state.navbarListItemToEdit.title
        : '';
    return this.state.showPopup ? (
      <Popup
        textValue={textValue}
        onPopupSave={this.onPopupSave.bind(this)}
        onPopupCancel={this.onPopupCancel.bind(this)}
      />
    ) : null;
  }

  render() {
    console.log('App rendered');
    return (
      <div className="App">
        {this.createPopup()}
        <Navbar
          onNavbarListItemSelection={this.onNavbarListItemSelection.bind(this)}
          selectedNavbarListItemId={this.state.selectedNavbarListItemId}
          navbarList={this.state.navbarList}
          removeFromNavbarList={this.removeFromNavbarList.bind(this)}
          onEditNavbarListItem={this.onEditNavbarListItem.bind(this)}
          onAddNavbarListItem={this.onAddNavbarListItem.bind(this)}
        />
        <Content
          selectedNavbarListItemData={this.getSelectedNavbarListItem()}
          equitiesList={this.getEquitiesForSelectedNavbarListItem()}
          onAddEquity={this.onAddEquity.bind(this)}
          deletionMode={this.state.contentDeletionMode}
          setContentDeletionMode={this.setContentDeletionMode.bind(this)}
          onDeleteEquities={this.removeEquitiesFromNavbarListItem.bind(this)}
        />
      </div>
    );
  }
}

export default App;
