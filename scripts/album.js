var setSong = function(songNumber) {
    if(currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber =  parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber -1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
       formats: [ 'mp3' ],
       preload: true
    });
    setVolume(currentVolume);
};

var seek = function(time) {
    if(currentSoundFile) {
        currentSoundFile.setTime(time);
    }  
};

var setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');  
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' +
            '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
            '<td class="song-item-title">' + songName + '</td>' +
            '<td class="song-item-duration">' + songLength + '</td>' +
        '</tr>';
    
    var $row = $(template);
    
   var clickHandler = function() {
       var songNumber = parseInt($(this).attr('data-song-number'));

	   if(currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		  currentlyPlayingCell.html(currentlyPlayingSongNumber);
	   }
       if(currentlyPlayingSongNumber !== songNumber) {
                // Switch from Play -> Pause button to indicate new song is playing.
           setSong(songNumber);
           currentSoundFile.play();
           updateSeekBarWhileSongPlays();
           currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
           
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
           
            $(this).html(pauseButtonTemplate);       
            updatePlayerBarSong();
           
	   } else if (currentlyPlayingSongNumber === songNumber) {
           if(currentSoundFile.isPaused()) {
               $(this).html(pauseButtonTemplate);
               $('.main-controls .play-pause').html(playerBarPauseButton);
               currentSoundFile.play();
           } else {
               $(this).html(playButtonTemplate);
               $('.main-control .play-pause').html(playerBarPlayButton);
               currentSoundFile.pause();
           }
	   }
};
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt($(songNumberCell).attr('data-song-number'));
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt($(songNumberCell).attr('data-song-number'));
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
   
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
 
    for (var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }  
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }   
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

//var setupSeekBars = function() { //controls seekBars
//    var $seekBars = $('.player-bar .seek-bar'); //gets .player-bar (parent) .seek-bar (distant child) class
//
//    $seekBars.click(function(event) { //click event
//        var offsetX = event.pageX - $(this).offset().left; //offsets the bar
//        var barWidth = $(this).width();
//        var seekBarFillRatio = offsetX / barWidth;
//        if ($(this).parent().attr('class') == 'seek-control') { //seek-control is the song duration's seek-bar
//            seek(seekBarFillRatio * currentSoundFile.getDuration());
//        } else {
//            setVolume(seekBarFillRatio * 100); //changes the volume
//        }
//        updateSeekPercentage($(this), seekBarFillRatio);
//    });
//
//    $seekBars.find('.thumb').mousedown(function(event) { //mousedown event (hold mouse down); different from click: click is rapid press, mousedown is long press
//        var $seekBar = $(this).parent(); //whichever bar it is choosing; if it is on volume, then thumb's parent is volume's seek bar, similar with song seek-bar
//        $(document).bind('mousemove.thumb', function(event){ //moves mouse
//            var offsetX = event.pageX - $seekBar.offset().left;
//            var barWidth = $seekBar.width();
//            var seekBarFillRatio = offsetX / barWidth;
//            if ($seekBar.parent().attr('class') == 'seek-control') { //if it is song seek-bar, then do:
//                seek(seekBarFillRatio * currentSoundFile.getDuration());
//            } else { //otherwise, it has to be volume's seek-bar
//                setVolume(seekBarFillRatio);
//            }
//            updateSeekPercentage($seekBar, seekBarFillRatio);
//        });
//        $(document).bind('mouseup.thumb', function() { //when mouseup event happens. This requires $(document).bind, because mouse can be anywhere in the document, but moving in attempt to move thumb class. We want to bind/lock this event so seek-bar's thumb will still move even when mouse is no longer on thumb.
//            $(document).unbind('mousemove.thumb'); //unbinds mousemove
//            $(document).unbind('mouseup.thumb'); //unbinds mouseup
//        });
//    });
// };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var nextSong = function() {
  var getLastSongNumber = function(index) {
      return index == 0 ? currentAlbum.songs.length : index;
  };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    //Note that we're incrementing the song here
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    
    //set a new current song
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    //update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-sing-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var getLastSongNumber = function(index) {
      return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    //Note that we're decrementing the song here
    currentSongIndex--;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    
    //set a new current song
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    //update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-sing-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
        //store state of playing songs
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

