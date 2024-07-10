import './App.css';
import React, { Component } from 'react';
import NavBar from './components/NavBar';
import News from './components/News';
import LoadingBar from 'react-top-loading-bar';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export default class App extends Component {
  state = {
    loaded: 0
  };

  setLoadingProgress = (progress) => {
    this.setState({ loaded: progress });
  };

  render() {
    return (
      <div>
        <Router>
          <NavBar />
          <LoadingBar
            color='#f11946'
            progress={this.state.loaded}
          />
          <Routes>
            <Route path="/general" element={<News category='general' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/business" element={<News category='business' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/entertainment" element={<News category='entertainment' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/health" element={<News category='health' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/science" element={<News category='science' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/sports" element={<News category='sports' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
            <Route path="/technology" element={<News category='technology' pageSize={15} setLoadingProgress={this.setLoadingProgress} />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
