import './App.css';
import React, { Component } from 'react';
import NavBar from './components/NavBar';
import News from './components/News';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/general" element={<News category='general' pageSize={15}/>} />
            <Route path="/business" element={<News category='business' pageSize={15}/>} />
            <Route path="/entertainment" element={<News category='entertainment' pageSize={15}/>} />
            <Route path="/health" element={<News category='health' pageSize={15}/>} />
            <Route path="/science" element={<News category='science' pageSize={15}/>} />
            <Route path="/sports" element={<News category='sports' pageSize={15}/>} />
            <Route path="/technology" element={<News category='technology' pageSize={15}/>} />
          </Routes>
        </Router>
      </div>
    );
  }
}
