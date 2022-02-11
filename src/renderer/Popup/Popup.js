import { Component } from 'react';
import './Popup.css';

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = { textValue: '' };
  }

  onChange(event) {
    this.setState({ textValue: event.target.value });
  }

  onSave() {
    this.props.onPopupSave(this.state.textValue);
  }

  onCancel() {
    this.props.onPopupCancel();
  }

  render() {
    console.log('Popup rendered');
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>Popup</h1>
          <input
            value={this.state.textValue}
            onChange={this.onChange.bind(this)}
          />
          <button onClick={this.onSave.bind(this)}>Save</button>
          <button onClick={this.onCancel.bind(this)}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default Popup;
