import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const url = 'wss://url2app-service.herokuapp.com/ws';
const socket = new WebSocket(url);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      downloadUrl: undefined,
      build: {
        url: '',
        allowBrowsing: false,
        version: '1.0.0'
      }
    }
  }
  componentWillMount() {
    socket.onopen = () => {
      console.log('open');
    }

    socket.onmessage = (e) => {
      console.log(e.data);
      let data = JSON.parse(e.data);
      if (data.url) {
        this.setState({
          loading: false,
          downloadUrl: data.url
        });
      }
    };

    // A connection could not be made
    socket.onerror = (event) => {
      console.log(event);
    }

    // A connection was closed
    socket.onclose = (code, reason) => {
      console.log(code, reason);
    }
  }

  updateUrl = (evt) => {
    this.setState({
      build: {
        url: evt.target.value,
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">URL2APP</h1>
        </header>
        <p className="App-intro">
          <input value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
          <button
            onClick={() => {
              this.setState({ loading: true });
              socket.send(`/build${JSON.stringify(this.state.build)}`);
            }}
          >
            Build
          </button>
          </p>
          {
            this.state.downloadUrl ? 
            <a href={this.state.downloadUrl}>Download</a>
            :
            <div></div>
          }
      </div>
    );
  }
}

export default App;
