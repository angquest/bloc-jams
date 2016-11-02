var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assests/images/album_covers/01.png',
    songs: [
        {title: 'I\'m so Blue', duration: '4:26'},
        {title: 'Green with Envy', duration: '3:14'},
        {title: 'Lady in Red', duration: '5:01'},
        {title: 'Pink Flamingo', duration: '3:21'},
        {title: 'Magenta, the Pup', duration: '2:15'}
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assests/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator?', duration: '1:01'},
        {title: 'Ring, ring, ring', duration: '5:01'},
        {title: 'Fits in your pocket', duration: '3:21'},
        {title: 'Can you hear me now?', duration: '3:14'},
        {title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumQuestel = {
    title: 'Life',
    artist: 'Angela Questel',
    label: 'Q Music',
    year: '2016',
    albumArtUrl: 'assests/images/album_covers/02.png',
    songs: [
        {title: 'These', duration: '1:01'},
        {title: 'Are Values', duration: '5:01'},
        {title: 'For Assignment', duration: '3:21'},
        {title: 'Number', duration: '3:14'},
        {title: '11', duration: '2:15'}
    ]
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' +
            '<td class="song-item-number">' + songNumber + '</td>' +
            '<td class="song-item-title">' + songName + '</td>' +
            '<td class="song-item-duration">' + songLength + '</td>' +
        '</tr>';
    
    return template;
};
    
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function (album) {
   
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    albumSongList.innerHTML = '';
  
    for (var i = 0; i < album.songs.length; i++){
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    var albums = [albumPicasso, albumMarconi, albumQuestel];
    var index = 1;
    albumImage.addEventListener('click', function(event){
        setCurrentAlbum(albums[index]); 
        index++;
        if(index == albums.length){
            index = 0;
            
        }
    });
};