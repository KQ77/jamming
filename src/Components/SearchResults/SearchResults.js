import React from 'react';
import './SearchResults.css';
import {TrackList} from '../../Components/TrackList/TrackList';

export class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
            <TrackList isRemoval={false} 
                       onAdd={this.props.onAdd} 
                       tracks={this.props.searchResults}/>
            </div>
        )
    }
}