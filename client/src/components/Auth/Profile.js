import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Profile extends Component {
  shouldComponentUpdate(newProps, newState) {
    return false;
  }

  componentDidMount() {
    if (this.props.itunesAppStore.userInfo.id === null) {
      this.props.history.push(`/login`);
    }
  }

  render() {
    return (
      <div className="user-form-container">
        <div className="user-form profile">
          <h3>My Profile</h3>
          <table className="table table-user-information">
            <tbody>
              <tr><td>User Name:</td><td>{this.props.itunesAppStore.userInfo.username}</td>
              </tr>
              <tr>
                <td>Email:</td><td><a href={"mailto:" + this.props.itunesAppStore.userInfo.email}>{this.props.itunesAppStore.userInfo.email}</a></td>
              </tr>
            </tbody>
          </table>
          <footer>Your Profile Information</footer>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default withRouter(connect(mapStateToProps)(Profile));
