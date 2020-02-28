import React from 'react';
import './App.css';
import {SearchBar} from '../../Components/SearchBar/SearchBar';
import {Playlist} from '../../Components/Playlist/Playlist';
import {SearchResults} from '../../Components/SearchResults/SearchResults';
import {Spotify} from '../../util/Spotify';

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.authorize = this.authorize.bind(this);

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: [],
        
    }
  }
  addTrack(track) {
    let playlist = this.state.playlistTracks;
    if  (playlist.some(songObj => songObj.id === track.id)) {
      return
    }
    playlist.push(track);
    this.setState({
      playlistTracks: playlist, //array
    })
  }
  
  removeTrack(track) {
    let playlist = this.state.playlistTracks;
    playlist = playlist.filter(currentSong => currentSong.id !== track.id)
    console.log(playlist)
    this.setState({
      playlistTracks: playlist,
    })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name,})
  }
// if the song is in the playlist already, don't render it in the search results
  savePlaylist() {
    let playlist = this.state.playlistTracks;
    const trackURIs = playlist.map(track => track.URI);
    console.log('trackURIs', trackURIs);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => {
      this.setState({playlistName: 'New Playlist', playlistTracks: []})
    })
  }
  

    authorize() {
      Spotify.getAccessToken();
      this.setState({token: true})
    }
    search(term) {
      Spotify.search(term).then(searchResults => {
        if (this.state.playlistTracks) {
          let filteredResults = [];
          let playlist = this.state.playlistTracks;
          searchResults.forEach(track => {
             if(playlist.every(playlistSong => playlistSong.id !== track.id)) {
                filteredResults.push(track);
             }
          })
          console.log('filteredResults', filteredResults)
          this.setState({searchResults: filteredResults});
        }
      })
    }
    


  render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        {!(this.state.token) ? 
        <div id="authorize">
          <button className="SearchButton" onClick={this.authorize}>Authorize</button>
        </div>
        :
          ""
        }
        {this.state.token ? 
        <div>
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults  onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onRemove={this.removeTrack} 
                      playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>  
        </div>
        :
        ""
      }
      </div>
    </div>
    )
  }
}

