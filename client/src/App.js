import React, { Component } from "react";
import Main from "./components/Main";
import {
  withRouter, Route, Switch, Redirect, BrowserRouter as Router,
} from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchItunesApi,
  changeUserInputSearchBoxValue,
  changeUserInputListingType,
  changeUserInputSortBy,
  changeUserInputMaxResults,
  changeUserInfoId,
  changeUserInfoUsername,
  changeUserInfoEmail,
  fetchFavDataFromDatabase,
  transferDataFromLocalStorageToDB
} from "./actions/itunesAppActions";

class App extends Component {
  removeStringFromNull = obj => {
    for (let key in obj) {
      if (obj[key] === "null") {
        obj[key] = null;
      }
    }
  }

  changeInputValues = match => {
    this.removeStringFromNull(match.params)
    this.props.dispatch(changeUserInputListingType(match.params.listingType))
    this.props.dispatch(changeUserInputSearchBoxValue(match.params.searchBoxValue));
    this.props.dispatch(changeUserInputSortBy(match.params.sortBy));
    this.props.dispatch(changeUserInputMaxResults(match.params.maxResults));
  }

  fetch = match => {
    this.props.dispatch(fetchItunesApi(match.params.searchBoxValue, match.params.listingType, match.params.maxResults));
  };

  updateUserData = () => {
    fetch('/api/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.userInfo && responseJson.userInfo.id !== null) {
          this.props.dispatch(changeUserInfoId(responseJson.userInfo.id));
          this.props.dispatch(changeUserInfoEmail(responseJson.userInfo.email));
          this.props.dispatch(changeUserInfoUsername(responseJson.userInfo.username));
          (JSON.parse(localStorage.getItem("savedItemsObj")) !== undefined) && (this.props.dispatch(transferDataFromLocalStorageToDB(responseJson.userInfo.id)));
          this.props.dispatch(fetchFavDataFromDatabase(responseJson.userInfo.id));
        } else {
          this.props.dispatch(changeUserInfoId(null));
          this.props.dispatch(changeUserInfoEmail(null));
          this.props.dispatch(changeUserInfoUsername(null));
        }
      })
  }

  shouldComponentUpdate(newProps, newState) {
    return false;
  }

  componentDidMount() {
    this.updateUserData();
  }

  render() {
    return (
      <Router >
        <Switch>
          <Route
            path="/Search=:searchBoxValue&listingType=:listingType&sortBy=:sortBy&maxResults=:maxResults"
            render={({ match }) => {
              if (!this.props.itunesAppStore.comingFromInput && this.props.itunesAppStore.shouldFetch) {
                this.changeInputValues(match);
                this.fetch(match);
              };
              return <Main />;
            }}
          />
          <Route
            exact path="/"
            render={({ match }) => {
              return <Main />;
            }}
          />

          <Route
            exact path="/register"
            render={({ match }) => {
              return <Main />;
            }}
          />
          <Route
            exact path="/profile"
            render={({ match }) =>
              ((this.props.itunesAppStore.userInfo.id === null) ? <Redirect to='/login' /> : <Main />)
            }
          />

          <Route
            exact path="/login"
            render={({ match }) => {
              return ((this.props.itunesAppStore.userInfo.id !== null) ? <Redirect to='/profile' /> : <Main />)
            }
            }
          />

          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default withRouter(connect(mapStateToProps)(App));
