import './App.css';
import { Component } from 'react';
import Navbar from './Navbar/Navbar';
import Content from './Content/Content';
import Popup from './Popup/Popup';
import FirezFirebase from './firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNavbarListItemData: {},
      showPopup: false,
      popupAction: '',
      navbarList: [],
    };

    this.firezfirebase = new FirezFirebase();
    console.log('App constructor');
  }

  componentDidMount() {
    console.log('App componentDidMount()');
    this.firezfirebase.onNavbarListChange(this.updateNavbarList.bind(this));
    this.firezfirebase.onNavbarListItemChange(
      this.updateNavbarListItem.bind(this)
    );
  }

  updateNavbarList(newList) {
    this.setState({ navbarList: newList });
  }

  updateNavbarListItem(navbarListItem) {
    let navbarList = this.state.navbarList;
    navbarList[this.state.selectedNavbarListItemData.index] = navbarListItem;
    this.updateNavbarList(navbarList);
  }

  removeNavbarListItemSelection() {
    this.setState({
      selectedNavbarListItemData: {},
    });
  }

  onNavbarListItemSelection(data) {
    this.setState({ selectedNavbarListItemData: data });
  }

  addToNavbarList(navbarListItem) {
    this.firezfirebase.insertNavbarListItem(navbarListItem);
  }

  onAddNavbarListItem() {
    this.popupShow('addNavbarListItem');
  }

  removeFromNavbarList(id) {
    this.removeNavbarListItemSelection();
    this.firezfirebase.removeNavbarListItem(id);
  }

  onEditNavbarListItem(navbarListItem) {
    this.setState({
      navbarListItemToEdit: navbarListItem,
    });
    this.popupShow('editNavbarListItem');
  }

  editNavbarListItem(id, newTitle) {
    this.removeNavbarListItemSelection();
    this.firezfirebase.editNavbarListItem(id, newTitle);
  }

  popupShow(action) {
    this.setState({
      showPopup: true,
      popupAction: action,
      selectedNavbarListItemData: {},
    });
    console.log('popupShow');
  }

  onPopupSave(textValue) {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupSave');
    console.log(textValue);
    if (this.state.popupAction == 'editNavbarListItem') {
      this.editNavbarListItem(this.state.navbarListItemToEdit.id, {
        title: textValue,
      });
    } else if (this.state.popupAction == 'addNavbarListItem') {
      this.addToNavbarList({ title: textValue });
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
          selectedNavbarListItemData={this.state.selectedNavbarListItemData}
          navbarList={this.state.navbarList}
          removeFromNavbarList={this.removeFromNavbarList.bind(this)}
          onEditNavbarListItem={this.onEditNavbarListItem.bind(this)}
          onAddNavbarListItem={this.onAddNavbarListItem.bind(this)}
        />
        <Content
          selectedNavbarListItemData={this.state.selectedNavbarListItemData}
        />
      </div>
    );
  }
}

export default App;
