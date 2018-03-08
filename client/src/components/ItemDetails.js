import React, { Component } from "react";
import { connect } from "react-redux";
import { updateItemInfoModal } from ".././actions/itunesAppActions";
import closeBttnImg from ".././images/closeBttnImg.png";
import noImage from '../images/no_image.png';

class ItemDetails extends Component {
  shouldComponentUpdate(newProps, newState) {
    if (
      this.props.itunesAppStore.itemInfoForModal !== newProps.itunesAppStore.itemInfoForModal ||
      this.props.itunesAppStore.isSideBarOpen !== newProps.itunesAppStore.isSideBarOpen ||
      this.props.itunesAppStore.showItemInfoModal !== newProps.itunesAppStore.showItemInfoModal
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeItemInfoModal = () => {
    this.props.dispatch(updateItemInfoModal(null, false));
  };

  render() {
    if (this.props.itunesAppStore.showItemInfoModal) {
      let data = this.props.itunesAppStore.itemInfoForModal;
      let audioBook = false;
      if (data.wrapperType === "audiobook") {
        audioBook = true;
      }
      return (
        <div className="item-details-modal-main">
          <div className={"item-details-modal-container " + (!this.props.itunesAppStore.isSideBarOpen ? 'sidebar-closed' : '')}>
            <img
              className="close-bttn-img"
              src={closeBttnImg}
              alt="Close Button"
              onClick={this.closeItemInfoModal}
            />
            <ul>
              <li key={data.uniqueId} className="list">
                <div className="image-container">
                  <img src={data.artworkUrl100 || noImage} alt="" />
                </div>
                <div className="content-container">
                  {data.collectionCensoredName && <h4 className="name">{data.collectionCensoredName}</h4>}
                  {(data.trackCensoredName) && (!audioBook && (<p><span>Track Name: </span>{data.trackCensoredName}</p>))}
                  {(data.artistName) && (<p ><span>{audioBook ? "Author Name(s)" : "Artist Name(s)"}: </span> {data.artistName} </p>)}
                  {(data.currency && data.collectionPrice) && (<p ><span>Price: </span>{data.collectionPrice} {data.currency}</p>)}
                  {(data.description) && <p ><span>Description</span> {data.description} </p>}
                  {((audioBook && data.collectionViewUrl) || data.trackViewUrl) && (<button className="bttn more-details-bttn" onClick={() => window.open(audioBook ? data.collectionViewUrl : data.trackViewUrl)}>View {audioBook ? "Book" : "Track"}</button>)}
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps({ itunesAppStore }) {
  return { itunesAppStore };
}

export default connect(mapStateToProps)(ItemDetails);
