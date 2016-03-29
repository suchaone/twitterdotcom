$(document).ready(function() {
  var args = location.search.replace("?","").replace(/%20/g," ").split("___"); 
  $(".username").html(args[0]);
  $(".tweet-body").html(decodeURI(args[1]));
  $(".timestamp").html($(".timestamp").html() + " " + ((new Date()).getFullYear() + 1));

  var img = "https://twitter.com/" + args[0] + "/profile_image?size=bigger";

  if (args[0] === "jokeocracy")
    img = "images/jokeocracy.jpeg";
  else if (args[0] === "swarthyvillain")
    img = "images/swarthyvillain.jpg";

  $(".avi").attr("src", img);
});
