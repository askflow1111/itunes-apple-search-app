import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import {
  fetchItunesApi,
  changeUserInputSearchBoxValue,
  changeUserInputListingType,
  changeShouldFetch,
  changeComingFromInput,
  changeUserInputMaxResults,
  changeUrlToUserInput,
} from "../actions/itunesAppActions";

class AddInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: null,
    };
  }

  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.itunesAppStore;
    let newData = newProps.itunesAppStore;
    if (
      oldData.userInput.listingType !== newData.userInput.listingType ||
      oldData.userInput.searchBoxValue !== newData.userInput.searchBoxValue ||
      oldData.userInput.maxResults !== newData.userInput.maxResults ||
      oldData.userInput.sortBy !== newData.userInput.sortBy ||
      this.state.focused !== newState.focused
    ) {
      return true;
    } else {
      return false;
    }
  }

  trimSpaces = value => {
    if (value.trim() === "") {
      return false;
    } else {
      value = value.trim();
      return true;
    }
  };

  shouldSubmitForm = (prevProps) => {
    let oldUserInput = this.props.itunesAppStore.userInput;
    let newUserInput = prevProps.itunesAppStore.userInput;
    if (
      oldUserInput.listingType !== newUserInput.listingType ||
      oldUserInput.searchBoxValue !== newUserInput.searchBoxValue ||
      oldUserInput.sortBy !== newUserInput.sortBy
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    this.updateURL();
    if (this.shouldSubmitForm(prevProps)) this.submitForm();
  }

  submitForm = () => {
    this.props.dispatch(changeShouldFetch(true));
    this.props.dispatch(changeComingFromInput(true));
    this.props.dispatch(fetchItunesApi(this.refs.searchBox.value, this.props.itunesAppStore.userInput.listingType, this.props.itunesAppStore.userInput.maxResults));
  };

  updateURL = () => {
    if (this.trimSpaces(this.props.itunesAppStore.userInput.searchBoxValue)) {
      this.props.dispatch(changeUrlToUserInput(this.props.itunesAppStore.userInput.searchBoxValue, this.props.itunesAppStore.userInput.listingType, this.props.itunesAppStore.userInput.sortBy, this.props.itunesAppStore.userInput.maxResults, this.props.history))
    };
  };

  handleRadioOptionsChange = (e) => {
    this.props.dispatch(changeUserInputListingType(e.target.value))
  }

  handleSearchBoxValue = e => {
    this.props.dispatch(changeUserInputSearchBoxValue(e.target.value));
  }

  render() {
    const horizontalLabels = {
      0: 'Low',
      50: 'Medium',
      100: 'High'
    }

    return (
      <div className="add-input">
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          this.submitForm();
        }}>
          <div >
            <h3 className="heading"><span> Search</span></h3>
            <input
              type="text"
              id="thing"
              name="searchBox"
              required
              placeholder="Hi!"
              value={this.props.itunesAppStore.userInput.searchBoxValue}
              onChange={this.handleSearchBoxValue}
              ref="searchBox"
              className="search-box-input"
            />
            <div className="radio-bttns-group" onChange={this.handleRadioOptionsChange}>
              <div><input type="radio" value="all" checked={this.props.itunesAppStore.userInput.listingType === "all"} /> Search for everything</div>
              <br />
              <div><input type="radio" value="audiobook" checked={this.props.itunesAppStore.userInput.listingType === "audiobook"} /> Search for Audio Books</div>
            </div>
          </div>
          <div className='slider custom-labels'>
            <h3 className="heading"><span>   Max Results</span></h3>
            <Slider
              min={0}
              max={100}
              value={Number(this.props.itunesAppStore.userInput.maxResults)}
              labels={horizontalLabels}
              onChange={(e) => this.props.dispatch(changeUserInputMaxResults(e))}
              onChangeComplete={this.submitForm}
            />
            <hr />
          </div>
          <button className="bttn search-form-bttn">Search</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default withRouter(connect(mapStateToProps)(AddInput));
