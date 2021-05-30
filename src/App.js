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
      pageCount: 2
    }
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
      .then(friendsJson => this.setState({ friendsList: friendsJson, friendsListDefault: friendsJson }))
  }
  componentDidMount = () => {
    this.getData();
  }
  updateFriendName = (event) => {
    this.setState({ friendName: event.target.value });
    // console.log(this.state.friendName);
  }
  addFriend = (event) => {
    // console.log(this.state.friendName);
    let addToList = this.state.friendsListDefault.concat([{ name: this.state.friendName, isFavourite: false }]);
    this.setState({ searchFriendText: "", friendName: "", friendsList: addToList, friendsListDefault: addToList });
    event.preventDefault();
  }
  searchFriend = (event) => {
    this.setState({ searchFriendText: event.target.value });
    let filteredFriends = this.state.friendsListDefault.filter(friend => friend.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.setState({ friendsList: filteredFriends });
  }
  render() {
    return (
      <div className="friends">
        <div className="container friends-wrapper">
          <div className="friends-list-label">
            <span className="input-group">
              <span className="label"><b>Friends List</b></span>
              <input className="search-friends form-control" type="text" placeholder="Search friend's"
                value={this.state.searchFriendText} onChange={this.searchFriend}>
              </input>
              <span className="input-group-addon">
                <i className="fa fa-search"></i>
              </span>
            </span>
          </div>
          <form onSubmit={this.addFriend}>
            <input className="add-friend-input" type="text" placeholder="Enter your friend's name"
              value={this.state.friendName} onChange={this.updateFriendName}>
            </input>
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
                    <i className="fa fa-star-o"></i>
                    <i className="fa fa-trash"></i>
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
