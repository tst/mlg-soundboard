
window.onload = init;
var context;
var bufferLoader;

/* buffer loader class */

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function(e) {
    alert('BufferLoader: XHR error');
    console.log(e);
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
}

/* end */



var soundfiles = new Array("2SAD4ME.mp3",
                           "AIRHORN.mp3",
                           "Darude - Dankstorm.mp3",
                           "HITMARKER.mp3",
                           "MOM GET THE CAMERA.mp3",
                           "Oh Baby A Triple.mp3",
                           "OMG TRICKSHOT CHILD.mp3",
                           "OOOOOOOOHMYGOOOOD.mp3",
                           "SANIC.mp3",
                           "SKRILLEX Scary.mp3",
                           "SMOKE WEEK EVERYDAY.mp3",
                           "WOMBO COMBO.mp3",
                           "DAMN SON WHERED YOU FIND THIS.mp3",
                           "Whatcha Say.mp3",
                           "2SED4AIRHORN.mp3",
                           "tactical nuke.mp3",
                           "intervention 420.mp3",
                           "AIRPORN.mp3");

var sourcefiles = new Array("https://www.youtube.com/watch?v=JSnR80kY0m0",
                            "https://www.youtube.com/watch?v=IpyingiCwV8",
                            "https://www.youtube.com/watch?v=u9ymUX1fJLw",
                            "https://www.dropbox.com/s/3nh8u7nrql96k48/HITMARKER.wav",
                            "https://www.youtube.com/watch?v=gl33V3fh7k0",
                            "https://www.youtube.com/watch?v=B8LpUA06HEo",
                            "https://www.youtube.com/watch?v=auAvDJlMOQ8",
                            "https://www.youtube.com/watch?v=b_yMiLwxae0",
                            "https://www.youtube.com/watch?v=hU7EHKFNMQg",
                            "https://www.youtube.com/watch?v=WSeNSzJ2-Jw",
                            "https://www.youtube.com/watch?v=KlujizeNNQM",
                            "https://www.youtube.com/watch?v=pD_imYhNoQ4",
                            "https://www.youtube.com/watch?v=pD_imYhNoQ4",
                            "https://www.youtube.com/watch?v=thhaf-bKWyg",
                            "https://soundcloud.com/gay-bagel/sad-airhorn",
                            "https://www.youtube.com/watch?v=cLI8wtbCIkM",
                            "https://www.youtube.com/watch?v=1O-dqWQOc8s",
                            "https://www.youtube.com/watch?v=Ks5bzvT-D6I");


function init() {
    // sources and download links
    $("#sourcelinks").append("<ul class=\"list-group\">");
    var sourcelinks = $("#sourcelinks ul");
    $.each(soundfiles, function (i) {
        sourcelinks.append("<li class=\"list-group-item\"><a href=\"" + sourcefiles[i] + "\" target=\"_blank\">" + soundfiles[i].slice(0, -4) + "</a></li>")
    });
    
    $("#downloadlinks").append("<ul class=\"list-group\">");
    var downloadlinks = $("#downloadlinks ul");
    $.each(soundfiles, function (i) {
        downloadlinks.append("<li class=\"list-group-item\"><a href=\"http://soundboard.panictank.net/" + soundfiles[i] + "\">" + soundfiles[i] + "</a></li>")
    });

    // soundboard stuff
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context,
        soundfiles,
        finishedLoading
        );

    bufferLoader.load();
}

var bList;

function finishedLoading(bufferList) {
    bList = bufferList;
    
    $("#loading").hide();
    /* add buttons */
    for (var i = 0; i < soundfiles.length; ++i)
    {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.value = soundfiles[i].slice(0,-4);
        btn.id = i;
        btn.onclick = function() { playS(bList[this.id]); };
        btn.classList.add("btn", "btn-primary", "btn-lg");

        document.getElementById("buttons").appendChild(btn);
    }


    /* add keyboard controls 48 */
    $(document).keypress(function (e) {
        if (e.which >= 48 && e.which <= 57) {
            $("#" + (e.which - 48)).click();
        } else if (e.which >= 97 && e.which <= 122)
        {
            $("#" + (e.which - 87)).click();
        }
    });
}

function play(buffer, drive, gain) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    
    var gainN = context.createGain();
    gainN.gain.value = gain;
    
    source.connect(gainN);
    
    if (drive == 0)
    {
        gainN.connect(context.destination); 

    } else {

        var overdrive = new Overdrive(context);
        overdrive.drive = drive;
        overdrive.color = 8000;
        gainN.connect(overdrive.input);

        var gain2 = context.createGain();
        overdrive.connect(gain2);

        gain2.gain.value = 2.6;
        gain2.connect(context.destination);
    }
    
    source.start(0);
}



function playS(buf) {
    var drive = document.getElementById("drive").value / 10.0;
    var gain = document.getElementById("gain").value;
    play(buf, drive, gain);
}

