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
    console.log('playlistTrackcs state', this.state.playlistTracks);
    this.setState({
      playlistTracks: playlist, //array
    })
  }
  
  removeTrack(track) {
    let playlist = this.state.playlistTracks;
    playlist = playlist.filter(currentSong => currentSong.id !== track.id)
    this.setState({
      playListTracks: playlist,
    })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name,})
  }

  savePlaylist() {
    let playlist = this.state.playlistTracks;
    const trackURIs = playlist.map(track => track.URI);
    console.log('trackURIs', trackURIs);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => {
      this.setState({playlistName: 'New Playlist', playlistTracks: []})
    })
  }
  
      search(term) {
      Spotify.search(term).then(searchResults => {
        this.setState({searchResults: searchResults})
      })
    }


  render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
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
    </div>
    )
  }
}

