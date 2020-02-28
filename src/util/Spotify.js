let accessToken;
// const redirectURI = encodeURI('https://jammy-jams.surge.sh/');
const redirectURI = encodeURI('http://localhost:3001/');
const id= '186f4ea56a7f427a8c9f7eb8d6ee8e1d';

export const Spotify = {
    
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } 

        let newUrl = window.location.href;
        const tokenMatch = newUrl.match(/access_token=([^&]*)/);
        const expiresMatch = newUrl.match(/expires_in=([^&]*)/);

        if(tokenMatch && expiresMatch) {
            accessToken = tokenMatch[1] 
            const expiresIn = Number(expiresMatch[1]) 
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        if(!accessToken) {
            window.location = `https://accounts.spotify.com/authorize?client_id=${id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })  
        .then(response => {
            return response.json()
        })
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    URI: track.uri,
                    preview: track.preview_url,

                })
            )
        });
    },
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers,
        })
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id
            return  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({name: playlistName}),
            })
        })
        .then (response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({uris: trackURIs}),
            })
        })
        .then(response => response.json())
        .then(jsonResponse => {
            const playlistId = jsonResponse.snapshot_id;
        });
    }
}