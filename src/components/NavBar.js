import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class NavBar extends Component {
  state = {
    isMenuOpen: false,
  };

  toggleMenu = () => {
    this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  closeMenu = () => {
    this.setState({ isMenuOpen: false });
  };

  render() {
    const { isMenuOpen } = this.state;

    return (
      <nav 
        className="navbar navbar-expand-lg bg-body-tertiary" 
        style={{ maxWidth: "140vh", margin: "0 auto" }}
      >
        <div className="container-fluid">
          {/* Mobile menu button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible menu */}
          <div 
            className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} 
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {[
                { path: "/general", label: "General" },
                { path: "/business", label: "Business" },
                { path: "/entertainment", label: "Entertainment" },
                { path: "/health", label: "Health" },
                { path: "/science", label: "Science" },
                { path: "/sports", label: "Sports" },
                { path: "/technology", label: "Technology" },
              ].map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    className="nav-link"
                    activeClassName="active"
                    exact={item.path === "/general"}
                    to={item.path}
                    onClick={this.closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}