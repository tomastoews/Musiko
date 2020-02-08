
// DOCUMENTATION:
// https://www.npmjs.com/package/spotify-web-api-node

const fs = require('fs');
const timeConvert = require('time-convert');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }
);

/* spotifyApi.refreshAccessToken().then(
   function(data) {
     console.log('The access token has been refreshed!');

     // Save the access token so that it's used in future calls
     spotifyApi.setAccessToken(data.body['access_token']);
   },
   function(err) {
     console.log('Could not refresh access token', err);
   }
); */

function getStaticData(field) {
    const fileContent = fs.readFileSync('data/data.json', 'utf8');
    if (!fileContent) return null;
    return JSON.parse(fileContent)[field];
}

function getSongs(query, limit) {
    return new Promise((resolve, reject) => {
        spotifyApi.searchTracks(query, {limit}).then(
            (data) => {
                const songs = data.body.tracks.items.map(item => {
                    return {
                        name: item.name,
                        id: item.id,
                        duration: msToM(item.duration_ms),
                        artist: item.album.artists[0],
                        popularity: item.popularity,
                        album: item.album.name,
                        preview_img_lg: item.album.images[0].url,
                        preview_img_md: item.album.images[1].url,
                        preview_img_sm: item.album.images[2].url
                    };
                }); 
                resolve(songs);
            }, 
            (err) => {
                console.error(err);
                reject([]);
            }
        );
    });
};

function getSong(song) {
    return new Promise((resolve, reject) => {
        spotifyApi.searchTracks(`tracḱ:${song}`).then(
            (data) => {
                //console.log(data);
                if (data.body.tracks.items.length != 0) {
                    const item = data.body.tracks.items[0];
                    const song = {
                        name: item.name,
                        id: item.id,
                        duration: msToM(item.duration_ms),
                        artists: item.artists.map(item => {
                            return {
                                name: item.name,
                                id: item.id
                            }
                        }),
                        popularity: item.popularity,
                        preview_url: item.preview_url,
                        album: {
                            name: item.album.name,
                            id: item.album.id,
                            release_date: item.album.release_date,
                            total_tracks: item.album.total_tracks,
                            preview_img_lg: item.album.images[0].url,
                            preview_img_md: item.album.images[1].url,
                            preview_img_sm: item.album.images[2].url
                        }
                    };
                    resolve(song);
                } else {
                    reject({});
                }
            },
            (error) => {
                console.error(error);
                reject({});
            }
        );
    });
}

function getAlbums(query, limit) {
    return new Promise((resolve, reject) => {
        spotifyApi.searchAlbums(query, {limit}).then(
            (data) => {
                const albums = data.body.albums.items.map(item => {
                    return {
                        name: item.name,
                        id: item.id,
                        preview_img_lg: item.images[0].url,
                        preview_img_md: item.images[1].url,
                        preview_img_sm: item.images[2].url
                    }
                });
                resolve(albums);
            },
            (error) => {
                console.error(error);
                reject([]);
            }
        )
    });
}

function getAlbum(album) {
    return new Promise((resolve, reject) => {
        spotifyApi.getAlbum(album).then(
            (data) => {
                const album = {
                    name: data.body.name,
                    id: data.body.id,
                    artists: data.body.artists.map(item => {
                        return {
                            name: item.name,
                            id: item.id
                        }
                    }),
                    genres: data.body.genres,
                    popularity: data.body.popularity,
                    release_date: data.body.release_date,
                    total_tracks: data.body.total_tracks,
                    preview_img_lg: data.body.images[0].url,
                    preview_img_md: data.body.images[1].url,
                    preview_img_sm: data.body.images[2].url,
                    tracks: data.body.tracks.items.map(item => {
                        return {
                            name: item.name,
                            id: item.id,
                            duration: msToM(item.duration_ms)
                        }
                    })
                }
                resolve(album);
            },
            (error) => {
                console.error(error);
                reject({});
            }
        );
    });
}

function getArtistAlbums(artistId) {
    return new Promise((resolve, reject) => {
        spotifyApi.getArtistAlbums(artistId).then(
            (data) => {
                const albums = data.body.items.map(item => {
                    return {
                        name: item.name,
                        id: item.id,
                        preview_img_lg: item.images[0].url,
                        preview_img_md: item.images[1].url,
                        preview_img_sm: item.images[2].url
                    }
                });
                resolve(albums);
            },
            (error) => {
                console.error(error);
                reject([]);
            }
        )
    });
}

function getArtists(artistsData) {
    return new Promise((resolve, reject) => {
        const artistsIds = artistsData.map(artist => artist.id);
        spotifyApi.getArtists(artistsIds).then(
            (data) => {
                const artists = data.body.artists.map(artist => {
                    return {
                        name: artist.name,
                        id: artist.id,
                        genres: artist.genres,
                        popularity: artist.popularity,
                        preview_img_lg: artist.images[0].url,
                        preview_img_md: artist.images[1].url,
                        preview_img_sm: artist.images[2].url,
                    }
                });
                resolve(artists);
            }, 
            (error) => {
                console.error(error);
                reject([]);
            }
        );
    });
}

function getArtist(artistId) {
    return new Promise((resolve, reject) => {
        spotifyApi.getArtist(artistId).then(
            (data) => {
                const artist = {
                    name: data.body.name,
                    id: data.body.id,
                    genres: data.body.genres,
                    popularity: data.body.popularity,
                    preview_img_lg: data.body.images[0].url,
                    preview_img_md: data.body.images[1].url,
                    preview_img_sm: data.body.images[2].url,
                };
                resolve(artist);
            },
            (error) => {
                console.error(error);
                reject({});
            }
        );
    });
}

function searchArtists(query) {
    return new Promise((resolve, reject) => {
        spotifyApi.searchArtists(query).then(
            (data) => {
                const artists = data.body.artists.items.map(artist => {
                    return {
                        name: artist.name,
                        id: artist.id
                    }
                });
                resolve(artists);
            }, 
            (error) => {
                console.error(error);
                reject([]);
            }
        );
    });
}

function searchSongs(query, page) {
    return new Promise((resolve, reject) => {
        spotifyApi.searchTracks(query, {offset:page}).then(
            (data) => {
                const songs = data.body.tracks.items.map(song => {
                    return {
                        name: song.name,
                        id: song.id,
                        duration: song.duration_ms,
                        popularity: song.popularity,
                        artists: song.artists.map(artist => {
                            return {
                                name: artist.name,
                                id: artist.id
                            }
                        }),
                        album: {
                            name: song.album.name,
                            id: song.album.id
                        },
                        preview_img_lg: song.album.images[0].url,
                        preview_img_md: song.album.images[1].url,
                        preview_img_sm: song.album.images[2].url
                    }
                });
                resolve(songs);
            }, 
            (error) => {
                console.error(error);
                reject([]);
            }
        );
    });
}

function getFeaturedArtsts() {
    console.log(getStaticData('featuredArtsts'));
    return getStaticData('featuredArtsts');
}

function getFeaturedGenres() {
    console.log(getStaticData('featuredGenres'));
    return getStaticData('featuredGenres');
}

const msToM = ms => (
    timeConvert.ms.to(timeConvert.m, timeConvert.s)(ms)
        .map(n => n < 10? '0'+n : n.toString())
        .join(':')
);

module.exports = {
    getSongs,
    getSong,
    getAlbums,
    getAlbum,
    getArtistAlbums,
    getArtists,
    getArtist,
    searchArtists,
    searchSongs,
    getFeaturedArtsts,
    getFeaturedGenres
};