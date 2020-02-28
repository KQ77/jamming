import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';


export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(e) {
        let name = e.target.value;
        this.props.onNameChange(name);
    }

    render() {
        return (
            <div>
                <div id="playlistDiv" className="Playlist">
                    
                    <input  defaultValue={"New Playlist"}
                            onChange={this.handleNameChange} />
                    <TrackList 
                        onRemove={this.props.onRemove} 
                        showPreview={false}
                        tracks={this.props.playlistTracks}
                        isRemoval={true}/>
                {this.props.playlistTracks.length ? 
                    <button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
                    :
                    ""
                }
                </div>
            </div>
        )
    }
}