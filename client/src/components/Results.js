import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateMenu,
  updateResults,
  areTwoArrSame,
  updateItemInfoModal,
  addFavItemToDB,
  deleteFavItemFromDB
} from ".././actions/itunesAppActions";
import FlipMove from 'react-flip-move';
import noImage from '../images/no_image.png';

class Results extends Component {
  shouldComponentUpdate(newProps, newState) {
    if (
      this.props.itunesAppStore.fetched !== newProps.itunesAppStore.fetched ||
      this.props.itunesAppStore.itunesApiData !== newProps.itunesAppStore.itunesApiData ||
      this.props.itunesAppStore.updateResults !== newProps.itunesAppStore.updateResults ||
      this.props.itunesAppStore.userInput.sortBy !== newProps.itunesAppStore.userInput.sortBy ||
      JSON.stringify(this.props.itunesAppStore.favDataFromDB) !== JSON.stringify(newProps.itunesAppStore.favDataFromDB) ||
      !this.props.dispatch(areTwoArrSame(this.props.itunesAppStore.itunesApiData, newProps.itunesAppStore.itunesApiData))
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleFavButton = (item, wrapperType) => {
    if (this.props.itunesAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj")) || {};
      if (savedItemsObj[item.uniqueId] === undefined) {
        savedItemsObj[item.uniqueId] = item;
      } else if (savedItemsObj[item.uniqueId] !== undefined) {
        delete savedItemsObj[item.uniqueId];
      }
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      // this.forceUpdate();
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      if (this.props.itunesAppStore.favDataFromDB[item.uniqueId] === undefined) {
        this.props.dispatch(addFavItemToDB(item, this.props.itunesAppStore.userInfo.id));
      } else {
        this.props.dispatch(deleteFavItemFromDB(item.uniqueId, this.props.itunesAppStore.userInfo.id));
      }
    }
  };

  handleMoreDetailsBttn = (item) => {
    this.props.dispatch(updateItemInfoModal(item, true));
  }

  sortList = arr => {
    if (this.props.itunesAppStore.userInput.sortBy !== "Best Match") {
      let newArr = [...arr].sort((a, b) => {
        let nameA = (a.collectionCensoredName && "collectionCensoredName") || (a.trackCensoredName && "trackCensoredName") || (a.uniqueId && "uniqueId");
        let nameB = (b.collectionCensoredName && "collectionCensoredName") || (b.trackCensoredName && "trackCensoredName") || (b.uniqueId && "uniqueId");
        if (this.props.itunesAppStore.userInput.sortBy === "Ascending Order (A to Z)") {
          return a[nameA].localeCompare(b[nameB])
        } else {
          return b[nameB].localeCompare(a[nameA])
        }
      })
      return newArr;
    }
    return arr;
  }

  renderList = () => {
    let savedItemsObj = (this.props.itunesAppStore.hasFetchedFavDataFromDB && this.props.itunesAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj"))) || {};
    if (this.props.itunesAppStore.itunesApiData.length > 0) {

      return this.sortList(this.props.itunesAppStore.itunesApiData).map((item, index) => {
        let audioBook = false;
        if (item.wrapperType === "audiobook") {
          audioBook = true;
        }
        return (
          <li key={item.uniqueId} className="list">
            <div className="image-container">
              <img src={item.artworkUrl100 || noImage} alt="" />
            </div>
            <div className="content-container">
              {item.collectionCensoredName && <h4 className="name">{item.collectionCensoredName}</h4>}
              {(item.trackCensoredName) && (!audioBook && (<p><span>Track Name: </span>{item.trackCensoredName}</p>))}
              {(item.artistName) && (<p ><span>{audioBook ? "Author Name(s)" : "Artist Name(s)"}: </span> {item.artistName} </p>)}
              {(item.currency && item.collectionPrice) && (<p ><span>Price: </span>{item.collectionPrice} {item.currency}</p>)}
              <button className="bttn more-details-bttn" onClick={() => this.handleMoreDetailsBttn(item)}>More Details</button>
              {((audioBook && item.collectionViewUrl) || item.trackViewUrl) && (<button className="bttn more-details-bttn" onClick={() => window.open(audioBook ? item.collectionViewUrl : item.trackViewUrl)}>View {audioBook ? "Book" : "Track"}</button>)}
              <div className={"fav-star " + ((savedItemsObj[item.uniqueId]) ? "fav-star-filled" : "")} onClick={() => this.handleFavButton(item)}></div>
            </div>
          </li>
        );
      });
    } else {
      return <h1>Nothing was found</h1>
    }
  };

  renderLoading = () => {
    return <h1 className="loading">Loading</h1>
  }

  render() {
    return (
      <div className="results">
        {(!this.props.itunesAppStore.fetched) ? this.renderLoading() : (
          <ul>
            <FlipMove className="flip-move" >
              {this.renderList()}
            </FlipMove>
          </ul>)}
      </div>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default connect(mapStateToProps)(Results);
