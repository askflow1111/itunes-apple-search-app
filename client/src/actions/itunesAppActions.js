export function fetchItunesApi(searchBoxValue, listingType, maxResults) {
  return function (dispatch) {
    let URL = `https://itunes.apple.com/search?`;
    URL += `term=${searchBoxValue}`;
    (listingType !== "all") && (URL += `&entity=${listingType}`);
    URL += `&limit=${maxResults}`;
    fetch(URL)
      .then(res => res.json())
      .then((responseJson) => {
        responseJson.results.forEach(e => {
          e.uniqueId = ((e.wrapperType === "audiobook") && e.collectionId) || (e.trackId);
        })
        dispatch({
          type: "FETCH_ITUNESAPI_FULFILLED",
          payload: {
            itunesApiData: responseJson.results,
          },
        });
      })
      .catch(err => {
        

        dispatch({ type: "FETCH_ITUNESAPI_REJECTED", payload: err });
      });
  };
}

export function transferDataFromLocalStorageToDB(userId) {
  return function (dispatch) {
    let favLocalStorageItems = JSON.parse(localStorage.getItem("savedItemsObj"));
    for (let key in favLocalStorageItems) {
      dispatch(addFavItemToDB(favLocalStorageItems[key], userId));
    }
    localStorage.setItem("savedItemsObj", null);
  };
}

export function fetchFavDataFromDatabase(userId) {
  return function (dispatch) {
    fetch('/fav/show', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        dispatch({ type: "FETCH_FAV_DATA_FROM_DATABASE_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function change_hasFetchedFavDataFromDB(data) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_hasFetchedFavDataFromDB", payload: data });
  };
}

export function addFavItemToDB(item, userId) {
  return function (dispatch) {
    fetch('/fav/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: userId,
        uniqueId: Number(item.uniqueId),
        collectionCensoredName: item.collectionCensoredName,
        trackCensoredName: item.trackCensoredName,
        collectionViewUrl: item.collectionViewUrl,
        currency: item.currency,
        collectionPrice: item.collectionPrice,
        wrapperType: item.wrapperType,
        artistName: item.artistName,
        artworkUrl100: item.artworkUrl100,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "ADD_FAV_ITEM_TO_DB_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function deleteFavItemFromDB(uniqueId, userId) {
  return function (dispatch) {
    fetch('/fav/destroy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        uniqueId: uniqueId,
        user_id: userId,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "DELETE_FAV_ITEM_FROM_DB_FULFILLED", payload: uniqueId });
      })
  };
}

export function areTwoArrSame(arrOne, arrTwo) {
  return function () {
    if (arrOne.length !== arrTwo.length) {
      return false;
    }
    for (let i = 0; i < arrOne.length; i++) {
      if (JSON.stringify(arrOne[i]) !== JSON.stringify(arrTwo[i]))
        return false;
    }
    return true;
  };
}

export function changeUrlToUserInput(searchBoxValue, listingType, sortBy, maxResults, history) {
  return function (dispatch) {
    history.push(`/Search=${searchBoxValue}&listingType=${listingType}&sortBy=${sortBy}&maxResults=${maxResults}`);
  };
}

export function changeUserInputSortBy(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SortBy", payload: value });
  };
}

export function changeUserInputListingType(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_ListingType", payload: value });
  };
}

export function changeUserInputSearchBoxValue(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SearchBoxValue", payload: value });
  };
}

export function changeUserInputMaxResults(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_MaxResults", payload: value });
  };
}

export function changeUserInfoId(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_ID", payload: value });
  };
}

export function changeUserInfoUsername(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_USERNAME", payload: value });
  };
}

export function changeUserInfoEmail(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_EMAIL", payload: value });
  };
}

export function playAuthFailedAnimation(ele, animation) {
  return function () {
    ele.classList.add(animation);
    setTimeout(() => {
      ele.classList.remove(animation);
    }, 1000);
  };
}

export function changeShouldFetch(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ShouldFetch", payload: value });
  };
}

export function changeComingFromInput(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ComingFromInput", payload: value });
  };
}

export function updateMenu() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_MENU", payload: null });
  };
}

export function updateResults() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_RESULTS", payload: null });
  };
}

export function reloadWebsite() {
  return function (dispatch) {
    dispatch({ type: "RESET_THE_SEARCH_DATA", payload: null });
  };
}

export function emptyFavDataFromDB() {
  return function (dispatch) {
    dispatch({ type: "EMPTY_FAV_DATA_FROM_DB", payload: null });
  };
}

export function updateSideBarState(value) {
  return function (dispatch) {
    dispatch({ type: "UPDATE_SIDEBAR_STATE", payload: value });
  };
}

export function updateItemInfoModal(itemInfoForModal, showItemInfoModal) {
  return function (dispatch) {
    dispatch({
      type: "ZOOM_IMAGE",
      payload: {
        itemInfoForModal,
        showItemInfoModal,
      },
    });
  };
}
