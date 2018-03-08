import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal, updateMenu, updateResults, updateSideBarState, deleteFavItemFromDB } from ".././actions/itunesAppActions";
import zoomBttnImg from ".././images/zoomBttnImg.png";
import delBttnImg from ".././images/delBttnImg.png";
import { scaleRotate as Menu } from "react-burger-menu";
import noImage from '../images/no_image.png';

class BurgerMenu extends Component {
  shouldComponentUpdate(newProps, newState) {
    return ((this.props.itunesAppStore.updateMenu !== newProps.itunesAppStore.updateMenu) || (JSON.stringify(this.props.itunesAppStore.favDataFromDB) !== JSON.stringify(newProps.itunesAppStore.favDataFromDB)));
  }

  deleteItem = id => {
    if (this.props.itunesAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj"));
      delete savedItemsObj[id];
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      this.props.dispatch(deleteFavItemFromDB(id, this.props.itunesAppStore.userInfo.id));
    }

  };

  openItem = item => {
    this.props.dispatch(updateItemInfoModal(item, true));
  };

  handleMenuStateChange = e => {
    this.props.dispatch(updateSideBarState(e.isOpen));
  }

  renderList = () => {
    let savedItemsObj = (this.props.itunesAppStore.hasFetchedFavDataFromDB && this.props.itunesAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj")));
    if (savedItemsObj !== null) {
      let listArr = [];
      for (let key in savedItemsObj) {
        let audioBook = false;
        if (savedItemsObj[key].wrapperType === "audiobook") {
          audioBook = true;
        }
        listArr.push(
          <li key={savedItemsObj[key].uniqueId}>
            <div className="img-container">
              <img src={savedItemsObj[key].artworkUrl100 || noImage} alt="" />
            </div>
            {((savedItemsObj[key].trackCensoredName) && (!audioBook && (<h4 className="name">{savedItemsObj[key].trackCensoredName}</h4>))) || ((savedItemsObj[key].collectionCensoredName) && (<h4 className="name">{savedItemsObj[key].collectionCensoredName}</h4>)) || (<h4>"N/A"</h4>)}
            <div className="options">
              <img
                onClick={e => this.openItem(savedItemsObj[key])}
                className="open-img-bttn"
                src={zoomBttnImg}
                alt="Zoom Button"
              />
              <img
                onClick={e => this.deleteItem(savedItemsObj[key].uniqueId)}
                className="delete-img-bttn"
                src={delBttnImg}
                alt="Delete Button"
              />
            </div>
          </li>
        )
      }
      return listArr;
    }
  };

  render() {
    return (
      <Menu
        onStateChange={this.handleMenuStateChange}
        className="sidebar"
        width={"15%"}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
      >
        <ul>{this.renderList()}</ul>
      </Menu>
    );
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default connect(mapStateToProps)(BurgerMenu);
