import "./App.css";
import Navbar from "./Navbar/Navbar";
import Content from "./Content/Content";
import Popup from "./Popup/Popup";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNavbarListItemData: {},
      showPopup: false,
      navbarList: [],
    };
    console.log("App constructor");
  }

  onNavbarListItemSelection(data) {
    this.setState({ selectedNavbarListItemData: data });
  }

  addToNavbarList(navbarListItem) {
    this.setState(prevState => ({
      navbarList: [...prevState.navbarList, navbarListItem]
    }))
  }

  removeFromNavbarList(id) {
    this.setState({
      navbarList: this.state.navbarList.filter(function(navbarListItem) { 
        return navbarListItem.id !== id 
      }),
      selectedNavbarListItemData: {}
    });
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
    this.addToNavbarList({id: this.state.navbarList.length, title: textValue});
  }

  onPopupCancel() {
    this.setState({
      showPopup: false,
    });
    console.log('onPopupCancel');
  }

  render() {
    console.log("App rendered");
    return (
      <div className="App">
        {this.state.showPopup ? (
          <Popup text="Close Me" onPopupSave={this.onPopupSave.bind(this)} onPopupCancel={this.onPopupCancel.bind(this)}/>
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
