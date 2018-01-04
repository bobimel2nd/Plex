$( document ).ready(function() {
  Initialize();
})

var plexBase = "http://192.168.1.100:32400";
var plexCode = "X-Plex-Token=vkqRfaPLgiVgf4nevfyx";
var gTitle = "";

function Initialize() {
  $("#keyMovie").on("click", function () {
    var def = "81451"
    var inp = prompt("Movie ID", def);
    plexGet(inp);
  });
  $("#srcMovie").on("click", function () {
    var def = "Star Trek"
    var inp = prompt("Movie Search", def);
    plexSearch(inp);
  });
}

function search(txt) {
  txt = txt.replace(" ", "+");
  txt = txt.replace(":", "+");
  txt = txt.replace("-", "+");
  txt = txt.replace(",", "+");
  return txt;
}

function plexPath(path) {
  return plexBase + path + "?" + plexCode;
}

function plexGet(movieID) {
  var queryURL = plexBase + "/library/metadata/" + movieID + "?" + plexCode;
  $.ajax({ 
    url: queryURL,
    headers: {"Accept": "application/json"}, 
    method: "GET" })
  .done(function(response) {
    displayMovie(response);
  })
}

function plexSearch(title) {
  gTitle = title;
  var queryURL = plexBase + "/search?query=" + search(title) + "&" + plexCode;
  $.ajax({ 
    url: queryURL, 
    headers: {"Accept": "application/json"}, 
    method: "GET" })
  .done(function(response) {
    displayMovieList(response);
  })
}

function displayMovie(jsonMovie) {
  var Movie = jsonMovie.MediaContainer.Metadata[0];
  $("#MovieInfoTitle").html("<b>" + Movie.title + " (" + Movie.year + ")</b><br><sub>" + Movie.tagline + "</sub>");
  $("#MovieInfo").text("");

  var row = $("<div>");
  row.addClass("row");
  row.text(Movie.summary);

  var pic = $("<img>");
  pic.attr('src', plexPath(Movie.thumb));
  pic.attr('alt', Movie.thumb);

  $("#MovieInfo").append(pic);
  $("#MovieInfo").append(row);
}

function displayMovieList(jsonMovie) {
  var Movies = jsonMovie.MediaContainer.Metadata;
  $("#MovieInfoTitle").html("<b>" + gTitle + "</b>");
  $("#MovieInfo").text("");

  for (var i=0; i<Movies.length; i++) {
    var row = $("<div>");
    row.addClass("row");
    row.html("<b>" + Movies[i].title + "</b> (" + Movies[i].year + ")<br>" + Movies[i].key + "<br>" + Movies[i].summary);

    var pic = $("<img>");
    pic.attr('src', plexPath(Movies[i].thumb));
    pic.attr('alt', Movies[i].thumb);

    var hrl = $("<hr>");

    $("#MovieInfo").append(pic);
    $("#MovieInfo").append(row);
    if (i<Movies.length-1) $("#MovieInfo").append(hrl);
  }
}
