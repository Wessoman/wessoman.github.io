$(document).ready(function () {

    //----- global variables-----------------------------------
    // create an array with prefilled topics
    var topics = ["kamen rider", "sukeban deka", "power rangers", "ultraman", "godzilla"];

    //----- functions------------------------------------------
    function makebuttons(btnnam) {
        var btn = document.createElement("button");
        var txt = document.createTextNode(String(btnnam));

        btn.appendChild(txt);
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "selector");
        btn.setAttribute("id", btnnam);
        return btn;
    }

    function showgifs(gifs) {
        for (var i = 0; i < gifs.length; i++) {
            var img = $("<img>"); //Equivalent: $(document.createElement('img'))
            img.attr('src', gifs[i].images.downsized_still.url);
            img.attr("id","img"+i);
            img.attr("moving","n");
            img.appendTo("#displarea");           
        }
    }

    //----- end of functions-----------------------------------

    //----- start----------------------------------------------
    // $(window).on("load", function () {

    // make buttons using the information in the array
    for (var i = 0; i < topics.length; i++) {
        $("#bttnarea").append(makebuttons(topics[i]));
    }

    // get new topics from input field
    // create a new button for the new topic
    $("#submit").click(function () {
        $("#bttnarea").append(makebuttons($("#newtop").val()));
        $("#newtop").val("");
    });

    $("#bttnarea").click(function () {
        var seltopic = event.target.id;

        // create an ajax call to pull data from glipghy when the button is clicked
        $.ajax({ url: "http://api.giphy.com/v1/gifs/search?q=" + seltopic + "&api_key=UPdOu5UCPQmeYuoJ4VKtSMhGZGyntyeB&limit=10", method: "GET" }).then(function (response) {

            // clear the space where the gifs will be shown
            $("#displarea").empty();
            showgifs(response.data);

            // click the gif to start and stop the motion
            $("#displarea").click(function(){
                var selimage=event.target.id;
                var ind=parseInt(selimage.charAt(3));

                if ($("#"+selimage).attr("moving")==="n") {
                    $("#" + selimage).attr("src", response.data[ind].images.downsized.url);
                    $("#" + selimage).attr("moving", "y");
                }
                else {
                    $("#" + selimage).attr("src", response.data[ind].images.downsized_still.url);
                    $("#" + selimage).attr("moving", "n");
                }
            });

        });

    });

});