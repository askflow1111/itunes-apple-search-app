import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Dropdown from 'react-dropdown'
import { changeUserInputSortBy, changeUrlToUserInput } from "../actions/itunesAppActions";

class SortBy extends Component {
  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.itunesAppStore;
    let newData = newProps.itunesAppStore;
    if (
      oldData.userInput.sortBy !== newData.userInput.sortBy
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleSortByChange = (e) => {
    this.props.dispatch(changeUserInputSortBy(e.value))
    if (this.props.itunesAppStore.userInput.searchBoxValue !== "") {
      this.props.dispatch(changeUrlToUserInput(this.props.itunesAppStore.userInput.searchBoxValue, this.props.itunesAppStore.userInput.listingType, this.props.itunesAppStore.userInput.sortBy, this.props.itunesAppStore.userInput.maxResults, this.props.history))
    }
  }

  render() {
    return (
      <div className="sortby">
        <Dropdown
          options={['Best Match', 'Ascending Order (A to Z)', 'Descending Order (Z to A']}
          onChange={this.handleSortByChange}
          value={this.props.itunesAppStore.userInput.sortBy}
          placeholder="Select an option"
          ref="sortBy"
        />
      </div>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default withRouter(connect(mapStateToProps)(SortBy));
