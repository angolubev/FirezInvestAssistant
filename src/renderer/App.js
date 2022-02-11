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
      navbarList: [],
    };

    this.firezfirebase = new FirezFirebase();
    console.log('App constructor');
  }

  componentDidMount() {
    console.log('App componentDidMount()');
    this.firezfirebase.onNavbarListChange(this.updateNavbarList.bind(this));
  }

  updateNavbarList(newList) {
    this.setState({ navbarList: newList });
  }

  onNavbarListItemSelection(data) {
    this.setState({ selectedNavbarListItemData: data });
  }

  addToNavbarList(navbarListItem) {
    this.firezfirebase.insertNavbarListItem(navbarListItem);
  }

  removeFromNavbarList(id) {
    this.setState({
      selectedNavbarListItemData: {},
    });
    this.firezfirebase.removeNavbarListItem(id);
  }

  onPopupShow() {
    this.setState({
      showPopup: true,
    });
    console.log('onPopupShow');
  }

  onPopupSave(textValue) {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupSave');
    console.log(textValue);
    this.addToNavbarList({ title: textValue });
  }

  onPopupCancel() {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupCancel');
  }

  render() {
    console.log('App rendered');
    return (
      <div className="App">
        {this.state.showPopup ? (
          <Popup
            text="Close Me"
            onPopupSave={this.onPopupSave.bind(this)}
            onPopupCancel={this.onPopupCancel.bind(this)}
          />
        ) : null}
        <Navbar
          onNavbarListItemSelection={this.onNavbarListItemSelection.bind(this)}
          selectedNavbarListItemData={this.state.selectedNavbarListItemData}
          showPopup={this.onPopupShow.bind(this)}
          navbarList={this.state.navbarList}
          removeFromNavbarList={this.removeFromNavbarList.bind(this)}
        />
        <Content
          selectedNavbarListItemData={this.state.selectedNavbarListItemData}
        />
      </div>
    );
  }
}

export default App;
