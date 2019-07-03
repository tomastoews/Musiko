const express = require('express');
const router = express.Router();
const service = require('./services/service');

router.get('/', async (req, res) => {
    const featuredSongs = await service.getSongs('Ice Cube', 8);
    const featuredArtsts = await service.getFeaturedArtsts();
    const featuredJazzAlbums = await service.getAlbums('jazz', 6);
    const featuredHipHopAlbums = await service.getAlbums('hip hop', 6);
    const featuredDanceAlbums = await service.getAlbums('dance', 6);
    const featuredGenres = service.getFeaturedGenres();

    res.render('home', { 
        featuredSongs: {
            title: 'Featured Songs',
            data: featuredSongs
        },
        featuredArtsts,
        featuredGenres,
        featuredDanceAlbums: {
            title: 'Pop Albums',
            data: featuredDanceAlbums
        },
        featuredHipHopAlbums: {
            title: 'Hip Hop Albums',
            data: featuredHipHopAlbums
        },
        featuredJazzAlbums: {
            title: 'Jazz Albums',
            data: featuredJazzAlbums
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
        featuredGenres
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
        featuredGenres
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
        featuredGenres
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
            search_query: search
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
            search_query: query
        });
    } else {
        res.redirect('/');
    }
});


module.exports = router;