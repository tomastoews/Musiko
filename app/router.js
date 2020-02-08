const express = require('express');
const router = express.Router();
const service = require('./services/service.js');
const baseURL = process.env.BASE_URL;

router.get('/', async (req, res) => {
    const featuredSongs = await service.getSongs('Ice Cube', 8);
    const featuredArtsts = await service.getFeaturedArtsts();
    const featuredJazzAlbums = await service.getAlbums('jazz', 6);
    const featuredHipHopAlbums = await service.getAlbums('hip hop', 6);
    const featuredDanceAlbums = await service.getAlbums('dance', 6);
    const featureRockAlbums = await service.getAlbums('rock', 6);
    const featureMetalAlbums = await service.getAlbums('metal', 6);
    const featuredGenres = service.getFeaturedGenres();

    res.render('home', { 
        featuredSongs: {
            title: 'Featured Songs',
            data: featuredSongs,
            baseURL
        },
        featuredArtsts,
        featuredGenres,
        featuredDanceAlbums: {
            title: 'Pop Albums',
            data: featuredDanceAlbums,
            baseURL
        },
        featuredHipHopAlbums: {
            title: 'Hip Hop Albums',
            data: featuredHipHopAlbums,
            baseURL
        },
        featuredJazzAlbums: {
            title: 'Jazz Albums',
            data: featuredJazzAlbums,
            baseURL
        },
        featuredRockAlbums: {
            title: 'Rock Albums',
            data: featureRockAlbums,
            baseURL
        },
        featuredMetalAlbums: {
            title: 'Metal Albums',
            data: featureMetalAlbums,
            baseURL
        }
    });
})

router.get('/album', async (req, res) => {
    res.redirect('/');
});

router.get('/album/:albumId', async (req, res) => {
    const { albumId } = req.params;
    const album = await service.getAlbum(albumId);
    album.artists = await service.getArtists(album.artists);
    const featuredArtsts = await service.getFeaturedArtsts();
    const featuredGenres = service.getFeaturedGenres();

    res.render('album', {
        album,
        featuredArtsts,
        featuredGenres,
        baseURL
    });
});

router.get('/song', async (req, res) => {
    res.redirect('/');
});

router.get('/song/:songId', async (req, res) => {
    const { songId } = req.params;
    const song = await service.getSong(songId);
    song.artists = await service.getArtists(song.artists);
    const featuredArtsts = await service.getFeaturedArtsts();
    const featuredGenres = service.getFeaturedGenres();
    
    res.render('song', {
        song,
        featuredArtsts,
        featuredGenres,
        baseURL
    });
});

router.get('/artist', async (req, res) => {
    res.redirect('/');
});

router.get('/artist/:artistId', async (req, res) => {
    const { artistId } = req.params;
    const artist = await service.getArtist(artistId);
    artist.albums = await service.getArtistAlbums(artistId);
    artist.total_albums = artist.albums.length;
    const featuredArtsts = await service.getFeaturedArtsts();
    const featuredGenres = service.getFeaturedGenres();

    res.render('artist', {
        artist,
        featuredArtsts,
        featuredGenres,
        baseURL
    });
});

router.get('/genre', async (req, res) => {
    if (req.query.search) {
        const { search } = req.query;
        const page = (req.query.page) ? req.query.page : 0;
        const songs = await service.searchSongs(`genre:${search}`, page);
        const featuredArtsts = await service.getFeaturedArtsts();
        const featuredGenres = service.getFeaturedGenres();

        res.render('genre_search', {
            songs,
            featuredArtsts,
            featuredGenres,
            search_options: {
                prevpage: (parseInt(page) == 0) ? 0 : parseInt(page) - 1,
                nextpage: parseInt(page) + 1,
                isFirstPage: (parseInt(page) == 0) ? true : false,
                isLastPage: (songs.length < 20) ? true : false,
                search: search
            },
            search_query: search,
            baseURL
        });
    } else {
        res.redirect('/');
    }
});

router.get('/search', async (req, res) => {
    if (req.query.query) {
        const { query } = req.query;
        const page = (req.query.page) ? req.query.page : 0;
        const songs = await service.searchSongs(query, page);
        const featuredArtsts = await service.getFeaturedArtsts();
        const featuredGenres = service.getFeaturedGenres();

        res.render('songs_search', {
            songs,
            featuredArtsts,
            featuredGenres,
            search_options: {
                prevpage: (parseInt(page) == 0) ? 0 : parseInt(page) - 1,
                nextpage: parseInt(page) + 1,
                isFirstPage: (parseInt(page) == 0) ? true : false,
                isLastPage: (songs.length < 20) ? true : false,
                search: query
            },
            search_query: query,
            baseURL
        });
    } else {
        res.redirect('/');
    }
});


module.exports = router;