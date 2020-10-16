$(document).ready(function() {
  // Variable to hold request
  var request;

  loadTimeline();

  function loadFeed(tweets) {
    $("#timeline").html("");
    $(tweets).each(function() {
      var $tweet = $("<li>");
      $tweet.addClass("user-" + this.gsx$username.$t.toLowerCase());
      $tweet.attr("data-plain", this.gsx$tweet.$t);

      var mentionPattern = /\B@[a-z0-9_-]+/gi;
      var mentions = this.gsx$tweet.$t.match(mentionPattern);

      this.gsx$tweet.$t = linkify(this.gsx$tweet.$t);

      $(mentions).each(function() {
        $tweet.addClass("mention-" + this.replace("@",""));
      });

      this.gsx$tweet.$t = this.gsx$tweet.$t.replace(mentionPattern, function(mention) {
        return "@<a class='mention-link' href='#" + mention.replace("@","") + "'>" + mention.replace("@","") + "</a>"
      });

      var img = "https://unavatar.now.sh/twitter/" + this.gsx$username.$t;

      if (this.gsx$username.$t.toLowerCase() === "jokeocracy")
        img = "images/jokeocracy.jpeg";
      else if (this.gsx$username.$t.toLowerCase() === "swarthyvillain")
        img = "images/swarthyvillain.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "angeltilalove")
        img = "images/tila.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "thesublemon")
        img = "images/thesublemon.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "lumenphosphor")
        img = "images/lumenphosphor.png";
      else if (this.gsx$username.$t.toLowerCase() === "nero")
        img = "images/nero.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "vesselofspirit" || this.gsx$username.$t.toLowerCase() === "secretofbeing" || this.gsx$username.$t.toLowerCase() === "cloneofsnow" || this.gsx$username.$t.toLowerCase() === "memberofspecies" || this.gsx$username.$t.toLowerCase() === "quantityofgood")
        img = "images/sun.jpeg";
      else if (this.gsx$username.$t.toLowerCase() === "menaquinone4")
        img = "images/mena.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "kantbot2000")
        img = "images/kantbot.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "paxdickinson")
        img = "images/paxdickinson.jpg";
      else if (this.gsx$username.$t.toLowerCase() === "TheViewFromHell")
        img = "https://twivatar.glitch.me/sarahdoingthing";

      var date = new Date(parseInt(this.gsx$timestamp.$t));

      $tweet.append("<img class='retweet' src='images/retweet.png'>");
      $tweet.append("<img class='avi' src='images/" + this.gsx$username.$t.toLowerCase() + ".jpg' onerror='this.onerror = null; this.src=\"" + img + "\"' >");
      $tweet.append("<a target='_blank' class='username' href='https://twitter.com/" + this.gsx$username.$t + "'>" + this.gsx$username.$t + "</a>");
      $tweet.append("&nbsp;&nbsp;<span class='timestamp'>" + timeSince(date) + "</span>");
      $tweet.append("<p class='text'>" + this.gsx$tweet.$t + "</p>");
      $("#timeline").prepend($tweet);
    });
  }

  function timeSince(date) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 43200);
    if (interval > 1)
      return months[date.getMonth()] + " " + date.getDate();
    interval = Math.floor(seconds / 3600);
    if (interval > 1)
      return interval + "h";
    interval = Math.floor(seconds / 60);
    if (interval > 1)
      return interval + "m";
    return Math.floor(seconds) + "s";
  }

  function loadTimeline() {
    $.ajax({
      url: "https://spreadsheets.google.com/feeds/list/1eTmadevM4H-DA47_kANt7mtSf2BwU-0yrIdkR4r7Yts/od6/public/values?alt=json-in-script&callback=DELETEME",
      complete: function(data) {
        var x = data.responseText;
        x = x.replace("DELETEME(", "");
        x = x.replace("// API callback", "");
        x = x.substring(0, x.length - 2);
        loadFeed($.parseJSON(x).feed.entry)
      }
    });
  }

  // Bind to the submit event of our form
  $("#publisher").submit(function(event) {

    // Abort any pending request
    if (request) {
      request.abort();
    }


    if ($("input[name='username']").val().length == 0 || $("input[name='tweet']").val().length == 0) {
      alert("there are two fields to fill out. not one, two.");
      return 0;
    }

    // robot scum
    if ($("input[name='email']").val().length > 0) {
      return 0;
    }

    // setup some local variables
    var $form = $(this);

    $("input[name='timestamp']").val(new Date().getTime());
    $("input[name='username']").val($("input[name='username']").val().replace("@","").replace(" ",""));     
    if ($("input[name='username']").val() === "") {
      $("input[name='username']").val("anon");
    }
    $("input[name='tweet']").val($("input[name='tweet']").val().substr(0,255)); 


    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");

    // Serialize the data in the form
    var serializedData = $form.serialize();
    
    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    request = $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzqolvaVA7MfY3uQzy66xM1w9w378UvonLplLZ7eMQAS43lEWFl/exec",
      type: "post",
      data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function(response, textStatus, jqXHR) {
      // Log a message to the console
      console.log("Hooray, it worked!");
      loadTimeline();

    });

    // Callback handler that will be called on failure
    request.fail(function(jqXHR, textStatus, errorThrown) {
      // Log the error to the console
      console.error(
        "The following error occurred: " +
        textStatus, errorThrown
      );
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function() {
      // Reenable the inputs
      $inputs.prop("disabled", false);
    });

    // Prevent default posting of form
    event.preventDefault();
  });

  $(document).on("click", ".retweet", function() {
    var username = $(this).parent().attr("class").split(" ")[0].replace("user-","");
    var text = encodeURI($(this).parent().attr("data-plain")).replace(/\%/g, "\%25"); 
    var url = "https://twitter.com/intent/tweet?text=http://suchaone.github.io/twitterdotcom/tweet.html?" + username + "___" + text;
    window.open(url);
  });

  $(document).on("click", "#timeline li", function() {
    var username = $(this).attr("class").split(" ")[0].replace("user-","");
    var text = encodeURI($(this).attr("data-plain")); 
    var url = "http://suchaone.github.io/twitterdotcom/tweet.html?" + username + "___" + text;
    window.open(url);
  });

  $(document).on("click", ".avi", function(e) {
    e.stopPropagation();
    var classes = $(this).parent().attr("class").split(" ");
    showThread(classes);
  });

  $(document).on("click", ".mention-link", function(e) {
    e.stopPropagation();
    var classes = [$(this).parent().attr("class").split(" ")[0]].concat("mention-" + $(this).html().toLowerCase());
    showThread(classes);
  });

  function showThread (classes) {
    var user = classes[0];

    if ($("#timeline").hasClass("profile")) {
      $("li").show();
      $("#timeline").removeClass("profile");
    } else {
      $("li").hide();
      $("." + user).show();

      $(classes).each(function() {
        $(".user-" + (this.toLowerCase() + "").replace("mention-","")).show();
      });
      
      $("#timeline").addClass("profile");
    }
  }

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

  var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
  
  var tagOrComment = new RegExp(
      '<(?:'
      // Comment body.
      + '!--(?:(?:-*[^->])*--+|-?)'
      // Special "raw text" elements whose content should be elided.
      + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
      + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
      // Regular name
      + '|/?[a-z]'
      + tagBody
      + ')>',
      'gi');

  function removeTags(html) {
    var oldHtml;
    do {
      oldHtml = html;
      html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
  }

});
