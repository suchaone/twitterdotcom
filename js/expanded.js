$(document).ready(function() {
  var args = location.search.replace("?","").replace(/%20/g," "); 
  debugger;
  var username = args.split("___")[0];
  $(".username").html(username);
  $(".tweet-body").html(linkify(decodeURI(args.substr(args.indexOf("___") + 3, args.length))));
  $(".timestamp").html($(".timestamp").html() + " " + ((new Date()).getFullYear() + 1));

  var img = "https://twitter.com/" + username + "/profile_image?size=bigger";

  if (username === "jokeocracy")
    img = "images/jokeocracy.jpeg";
  else if (username === "swarthyvillain")
    img = "images/swarthyvillain.jpg";

  $(".avi").attr("src", img);

  function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    
    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    
    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    
    return replacedText;
  }
});
