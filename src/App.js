import './App.css';
import Navbar from './Navbar/Navbar';
import Content from './Content/Content';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedNavbarListItemData: {}};
    console.log('App constructor');
  }

  onNavbarListItemSelection(data) {
    this.setState({selectedNavbarListItemData: data});
    console.log(data);
  }

  render() { 
    console.log('App rendered');
    return ( 
      <div className="App">
        <Navbar onNavbarListItemSelection={this.onNavbarListItemSelection.bind(this)} selectedNavbarListItemData={this.state.selectedNavbarListItemData} />
        <Content selectedNavbarListItemData={this.state.selectedNavbarListItemData}/>
      </div>
     );
  }
}

export default App;
