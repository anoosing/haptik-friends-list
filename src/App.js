// import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactPaginate from 'react-paginate';
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendName: "",
      friendsList: [],
      friendsListDefault: [],
      searchFriendText: "",
      error: "",
      pageCount: 0,
      currentPage: 1
    }
  }
  paginateData = (data, page = 1) => {
    let list = data,
    indexOfLastName = page * 4,
    indexOfFirstName = indexOfLastName - 4,
    currentList = list.slice(indexOfFirstName, indexOfLastName),
    pageCount = Math.ceil((list.length) / 4);
    this.setState({ pageCount });
    return currentList;
  }
  getData = () => {
    fetch('mockFriendsData.json'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then((response) => response.json())
      .then(friendsJson => {
        friendsJson = this.sortList(friendsJson);
        this.setState({ friendsList: this.paginateData(friendsJson), friendsListDefault: friendsJson })
      })
  }
  componentDidMount = () => {
    this.getData();
  }
  updateFriendName = (event) => {
    let error = ' ';
    if (event.target.value.trim() !== '' && !/^[a-zA-Z ]*$/.test(event.target.value)) {
      error = 'Name can consists of alphabets only.'
    }
    this.setState({ error, friendName: event.target.value });
  }
  addFriend = (event) => {
    let error = '';
    if (this.state.friendName.trim() === '') {
      error = 'Please enter a name.'
    } else if (!/^[a-zA-Z ]*$/.test(this.state.friendName)) {
      error = 'Name can consists of alphabets only.'
    } else if (this.state.friendName.length < 3) {
      error = 'Name should be of atleast 3 characters.';
    } else if (this.state.friendsListDefault.filter(friend => friend.name.trim('').toLowerCase() === this.state.friendName.trim().toLowerCase()).length) {
      error = 'Name already exists.';
    }
    if (!error) {
      let addToList = this.state.friendsListDefault.concat([{ name: this.state.friendName, isFavourite: false }]);
      addToList = this.sortList(addToList);
      this.setState({ error: "", searchFriendText: "", friendName: "", friendsList: this.paginateData(addToList), friendsListDefault: addToList });
    }
    else {
      this.setState({ error });
    }
    event.preventDefault();
  }
  searchFriend = (event) => {
    let filteredFriends = this.state.friendsListDefault.filter(friend => friend.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.setState({ error: "", friendsList: this.paginateData(filteredFriends), searchFriendText: event.target.value });
  }
  sortList = (list) => {
    let fav = [], unfav = [];
    list.sort((a, b) => a.name.localeCompare(b.name))
    list.forEach(item => {
      if (item.isFavourite)
        fav.push(item);
      else
        unfav.push(item);
    });

    return [...fav, ...unfav];
  }
  updateFavourite = (friend) => {
    let newList = [...this.state.friendsListDefault];
    let index = this.state.friendsListDefault.findIndex(friends => friends.name === friend.name);
    if (index > -1) newList[index] = { ...newList[index], isFavourite: !newList[index].isFavourite }
    newList = this.sortList(newList);
    this.setState({ error: "", searchFriendText: "", friendName: "", friendsList: this.paginateData(newList), friendsListDefault: newList });
  }
  deleteFriend = (friend) => {
    let newList = this.state.friendsListDefault.filter(friends => friends.name !== friend.name);
    newList = this.sortList(newList);
    this.setState({ error: "", searchFriendText: "", friendName: "", friendsList: this.paginateData(newList), friendsListDefault: newList });
  }
  resetSearch = () => {
    let filteredFriends = this.state.friendsListDefault.slice();
    this.setState({ error: "", friendsList: this.paginateData(filteredFriends), searchFriendText: "" });
  }
  handlePageClick = data => {
    this.setState({ friendsList: this.paginateData(this.state.friendsListDefault, data.selected + 1), currentPage: data.selected + 1 });
  }
  render() {
    return (
      <div className="friends">
        <div className="container friends-wrapper">
          <div className="friends-list-label">
            <span className="input-group">
              <span className="label"><b>Friends List</b></span>
              <input className="search-friends form-control" type="text" placeholder="Search friend's..."
                value={this.state.searchFriendText} onChange={this.searchFriend}>
              </input>
              <span className="input-group-addon">
                {this.state.searchFriendText ? <i onClick={this.resetSearch} className="fa fa-close"></i> : <i className="fa fa-search"></i>}
              </span>
            </span>
          </div>
          <form onSubmit={this.addFriend}>
            <input className="add-friend-input" type="text" placeholder="Enter your friend's name"
              value={this.state.friendName} onChange={this.updateFriendName}>
            </input>
            {!!this.state.error.length && <div className="small-font error-msg">{this.state.error}</div>}
          </form>
          <div>
            {
              this.state.friendsList.map((friend, index) =>
              (
                <div className="friends-list" key={index}>
                  <div className="friend-list-name">
                    <div>{friend.name}</div>
                    <div className="small-font">is your friend</div>
                  </div>
                  <div className="friends-list-icons">
                    <span onClick={() => this.updateFavourite(friend)}>
                      {
                        friend.isFavourite ? <i className="fa fa-star"></i> : <i className="fa fa-star-o"></i>
                      }
                    </span>
                    <i onClick={() => this.deleteFriend(friend)} className="fa fa-trash"></i>
                  </div>
                </div>
              )
              )
            }
          </div>
          <div className="friends-list-paginator">
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
