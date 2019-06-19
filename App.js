// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAs7I_Csh8-80JQnVPJA_tiyG9zEkJTOR0",
  authDomain: "kaquimusic.firebaseapp.com",
  databaseURL: "https://kaquimusic.firebaseio.com",
  projectId: "kaquimusic",
  storageBucket: "",
  messagingSenderId: "536533706423",
  appId: "1:536533706423:web:8040afb383cce8e3"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function initMap (){
  var austin = {
    lat: 30.2672,
    lng: -97.7431
  };
  var map = new google.maps.Map(document.getElementById("map"), {zoom: 12, center: austin});
  var marker = new google.maps.Marker({position: austin, map: map});
}

var map;
var marker;
var artist;
var discAPI = "nbWzmDGOIWYNqEfTMUMf";
var discSecret = "xXsCUsgkVJoNlsefHTBKmLfWKpdcTeAq";
var results = $("#results");
var searchForm = $("#searchForm");
var jumbotron = $("#jumbotron");

function lastGet(artist) {
  var lastAPI = "7b47760fe2aa1770bcb7927be1cb9d72";
  var lastQuery = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + lastAPI + "&format=json";
  $.ajax({
    url: lastQuery,
    method:"GET"
  }).then(function(response){
    console.log(response.artist);
    var band = response.artist;
    var name = $("<h5 class='card-title'>");
    var bandDiv = $("<div class='card-body'>");
    var bandSum = $("<p class='card-text'>");
    name.append(band.name);
    bandSum.append(band.bio.summary);
    bandDiv.append(name, bandSum);
    $("#lastFM").append(bandDiv);
  });
}

function discGet(artist) {
  var discQuery = "https://api.discogs.com/database/search?artist=" + artist + "&key=" + discAPI + "&secret=" + discSecret;
  $.ajax({
    url: discQuery,
    method: "GET"
  }).then(function(response){
    var resultsGet = response.results;
    console.log(resultsGet);
    var img1 = $("<img src="+resultsGet[0].cover_image+" style='width:250px;height:250px;'/>");
    var img2 = $("<img src="+resultsGet[1].cover_image+" style='width:250px;height:250px;'/>");
    var img3 = $("<img src="+resultsGet[2].cover_image+" style='width:250px;height:250px;'/>");
    var img4 = $("<img src="+resultsGet[3].cover_image+" style='width:250px;height:250px;'/>");
    var img5 = $("<img src="+resultsGet[4].cover_image+" style='width:250px;height:250px;'/>");
    var img6 = $("<img src="+resultsGet[5].cover_image+" style='width:250px;height:250px;'/>");
    // var img7 = $("<img src="+resultsGet[6].cover_image+" />");
    // var img8 = $("<img src="+resultsGet[7].cover_image+" />");
    var title1 = $("<p class='title'>"+resultsGet[0].title+"</p>");
    var title2 = $("<p class='title'>"+resultsGet[1].title+"</p>");
    var title3 = $("<p class='title'>"+resultsGet[2].title+"</p>");
    var title4 = $("<p class='title'>"+resultsGet[3].title+"</p>");
    var title5 = $("<p class='title'>"+resultsGet[4].title+"</p>");
    var title6 = $("<p class='title'>"+resultsGet[5].title+"</p>");
    // var title7 = $("<p class='title'>"+resultsGet[6].title+"</p>");
    // var title8 = $("<p class='title'>"+resultsGet[7].title+"</p>");

    $("#albums").append(
      $("<div class='albumBox'>").append(img1, title1),
      $("<div class='albumBox'>").append(img2, title2),
      $("<div class='albumBox'>").append(img3, title3),
      $("<div class='albumBox'>").append(img4, title4),
      $("<div class='albumBox'>").append(img5, title5),
      $("<div class='albumBox'>").append(img6, title6),
      // $("<div class='albumBox'>").append(img7, title7),
      // $("<div class='albumBox'>").append(img8, title8),
    );
  });
}

function photoGet(artist){
  var query = "https://api.discogs.com/database/search?q=" + artist + "&key=" + discAPI + "&secret=" + discSecret;
  $.ajax({
    url: query,
    method: "GET"
  }).then(function(response){
    var res = response.results;
    console.log(res);
    var bandImg = $("<img class='card-image-top' alt='searched artist'>");
    bandImg.attr("src", res[0].cover_image);
    $("#lastFM").prepend(bandImg);
  })
}

function eventGet(artist){
  var eventAPI = "wfmwtNQxwTgGBgc5";
  var eventQuery = "https://cors-anywhere.herokuapp.com/http://api.eventful.com/json/events/search/?q="+artist+"&app_key="+eventAPI+"&scheme=https";
  $.ajax({
    url: eventQuery,
    method: "GET"
  }).then(function(response){
    var artistGet = JSON.parse(response);
    console.log(artistGet.events.event);

    showOneLat = artistGet.events.event[0].latitude;
    showOneLng = artistGet.events.event[0].longitude;

    showTwoLat = artistGet.events.event[1].latitude;
    showTwoLng = artistGet.events.event[1].longitude;

    showThreeLat = artistGet.events.event[2].latitude;
    showThreeLng = artistGet.events.event[2].longitude;

    if ((!showOneLat && !showOneLng) && (!showTwoLat && showTwoLng) && (!showThreeLat && !showThreeLng)){
      markerOne.setMap(null);
      markerTwo.setMap(null);
      markerThree.setMap(null);
    }else {
      var showOne = new google.maps.LatLng(showOneLat, showOneLng);
      var showTwo = new google.maps.LatLng(showTwoLat, showTwoLng);
      var showThree = new google.maps.LatLng(showThreeLat, showThreeLng);

      var mapOptions = {
        zoom: 3.5,
        center: {lat: 40, lng: -100}
      }

      var contentStringOne = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5>'+artistGet.events.event[0].venue_name+'</h5>'+
      '<div id="bodyContent">'+
      '<p>'+artistGet.events.event[0].venue_address + ", " 
      + artistGet.events.event[0].city_name + " "
      + artistGet.events.event[0].region_name+'</p>'
      +'<a href='+artistGet.events.event[0].url+' target="_blank">Buy Tickets</a>'+
      '</div>'+
      '</div>';
  
      var infowindowOne = new google.maps.InfoWindow({
        content: contentStringOne
      });
  
      var contentStringTwo = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5>'+artistGet.events.event[1].venue_name+'</h5>'+
      '<div id="bodyContent">'+
      '<p>'+artistGet.events.event[1].venue_address + ", " 
      + artistGet.events.event[1].city_name + " "
      + artistGet.events.event[1].region_name+'</p>'
      +'<a href='+artistGet.events.event[1].url+' target="_blank">Buy Tickets</a>'+
      '</div>'+
      '</div>';
  
      var infowindowTwo = new google.maps.InfoWindow({
        content: contentStringTwo
      });
  
      var contentStringThree = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5 id="firstHeading" class="firstHeading">'+artistGet.events.event[2].venue_name+'</h5>'+
      '<div id="bodyContent">'+
      '<p>'+artistGet.events.event[2].venue_address + ", " 
      + artistGet.events.event[2].city_name + " "
      + artistGet.events.event[2].region_name+'</p>'
      +'<a href='+artistGet.events.event[2].url+' target="_blank">Buy Tickets</a>'+
      '</div>'+
      '</div>';
  
      var infowindowThree = new google.maps.InfoWindow({
        content: contentStringThree
      });
  
      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      markerOne = new google.maps.Marker({
        position: showOne,
        title: "Show one"
      });

      markerTwo = new google.maps.Marker({
        position: showTwo,
        title: "Show two"
      });
  
      markerThree = new google.maps.Marker({
        position: showThree,
        title: "Show three"
      });

      markerOne.setMap(map);
      markerTwo.setMap(map);
      markerThree.setMap(map);

      markerOne.addListener("click", function(){
        infowindowOne.open(map, markerOne);
      });
      markerTwo.addListener("click", function(){
        infowindowTwo.open(map, markerTwo);
      });
      markerThree.addListener("click", function(){
        infowindowThree.open(map, markerThree);
      });
    }
    
  });
}

function marketGet(artist) {
  var ebayAPI = "Anderson-Kaqui-PRD-651f9ce73-a5406c93";
  var ebayQuery = "https://cors-anywhere.herokuapp.com/https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME="+ebayAPI+"&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords="+artist+"&categoryId=11233&limit=4";
  $.ajax({
    url: ebayQuery,
    method: "GET"
  }).then(function(response){
    var ebayParse = JSON.parse(response);
    var ebay = ebayParse.findItemsAdvancedResponse;
    var ebayListing = ebay[0].searchResult[0].item;
    console.log(ebayListing[0]);

    var marketCard1 = $("<div class='card' id='card1'>");
    var img1 = $("<img src="+ebayListing[0].galleryURL[0]+" class='card-img-top'/>");
    var title1 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[0].title[0]+"</h5>");
    var link1 = $("<p class='card-text'><a href="+ebayListing[0].viewItemURL[0]+">Buy on Ebay</a></p>");
    
    var marketCard2 = $("<div class='card' id='card2'>");
    var img2 = $("<img src="+ebayListing[1].galleryURL[0]+" class='card-img-top'/>");
    var title2 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[1].title[0]+"</h5>");
    var link2 = $("<p class='card-text'><a href="+ebayListing[1].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard3 = $("<div class='card' id='card3'>");
    var img3 = $("<img src="+ebayListing[2].galleryURL[0]+" class='card-img-top'/>");
    var title3 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[2].title[0]+"</h5>");
    var link3 = $("<p class='card-text'><a href="+ebayListing[2].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard4 = $("<div class='card' id='card3'>");
    var img4 = $("<img src="+ebayListing[3].galleryURL[0]+" class='card-img-top'/>");
    var title4 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[3].title[0]+"</h5>");
    var link4 = $("<p class='card-text'><a href="+ebayListing[2].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard5 = $("<div class='card' id='card5'>");
    var img5 = $("<img src="+ebayListing[4].galleryURL[0]+" class='card-img-top'/>");
    var title5 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[4].title[0]+"</h5>");
    var link5 = $("<p class='card-text'><a href="+ebayListing[4].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard6 = $("<div class='card' id='card6'>");
    var img6 = $("<img src="+ebayListing[5].galleryURL[0]+" class='card-img-top'/>");
    var title6 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[5].title[0]+"</h5>");
    var link6 = $("<p class='card-text'><a href="+ebayListing[5].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard7 = $("<div class='card' id='card7'>");
    var img7 = $("<img src="+ebayListing[6].galleryURL[0]+" class='card-img-top'/>");
    var title7 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[6].title[0]+"</h5>");
    var link7 = $("<p class='card-text'><a href="+ebayListing[6].viewItemURL[0]+">Buy on Ebay</a></p>");

    var marketCard8 = $("<div class='card' id='card8'>");
    var img8 = $("<img src="+ebayListing[7].galleryURL[0]+" class='card-img-top'/>");
    var title8 = $("<h5 class='card-title' style='font-size:1rem;'>"+ebayListing[7].title[0]+"</h5>");
    var link8 = $("<p class='card-text'><a href="+ebayListing[7].viewItemURL[0]+">Buy on Ebay</a></p>");

    $("#market").append(
      $("<div class='row' id='marketRow'>").append(
        marketCard1.append(img1, 
          $("<div class='card-body'>").append(title1, link1)
        ),
        marketCard2.append(img2,
          $("<div class='card-body'>").append(title2, link2)
        ),
        marketCard3.append(img3,
          $("<div class='card-body'>").append(title3, link3)
        ),
        marketCard4.append(img4,
          $("<div class='card-body'>").append(title4, link4)
        )
      ),
      $("<div class='row' id='marketRow'>").append(
        marketCard5.append(img5,
          $("<div class='card-body'>").append(title5, link5)
        ),
        marketCard6.append(img6,
          $("<div class='card-body'>").append(title6, link6)
        ),
        marketCard7.append(img7,
          $("<div class='card-body'>").append(title7, link7)
        ),
        marketCard8.append(img8,
          $("<div class='card-body'>").append(title8, link8)
        )
      )
    );
  });
}

function LinkFormatter(value, row, index) {
  var tableSearch = $("<div id='tableSearch'>"+value+"</div>");
  tableSearch.on("click", function(){
    lastGet(value);
    photoGet(value);
    discGet(value);
    eventGet(value);
    marketGet(value);

    $("#lastFM").empty();
    $("#albums").empty();
    $("#market").empty();

    markerOne.setMap(null);
    markerTwo.setMap(null);
    markerThree.setMap(null);
  });
  return tableSearch;
}

$(document).ready(function(){
  results.addClass("d-none");
});

$("#searchButton").on("click", function(event){
  event.preventDefault();
  jumbotron.addClass("d-none");
  results.removeClass("d-none");
  $("body").attr("style", "background-image: linear-gradient(#38261F, #DE987A);");
  // results.addClass("spin");
  searchForm.addClass("d-none");
  $("#searchButton").addClass("d-none");
  artist = $("#bandInput").val();
  photoGet(artist);
  lastGet(artist);
  discGet(artist);
  eventGet(artist);
  marketGet(artist);
  database.ref().set({
    searchBand: artist
  });
  $("#resultsTable").removeClass("d-none");
  console.log(artist);
});

$("#newSearchButton").on("click", function(event){
  event.preventDefault();
  artist = $("#newBandInput").val();
  photoGet(artist);
  lastGet(artist);
  discGet(artist);
  eventGet(artist);
  marketGet(artist);
  database.ref().set({
    searchBand: artist
  });
  $("#newBandInput").val("");
});

database.ref().on("value", function(snapshot){
  console.log(snapshot.val());
  var band = snapshot.val().searchBand;
  $("#resultsTable > tbody").prepend(
    $("<tr>").prepend(
      $("<td>").prepend(LinkFormatter(band))
    )
  );
  $("#lastFM").empty();
  $("#albums").empty();
  $("#market").empty();
});