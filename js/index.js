$(document).ready(function() {
  // Variable to hold request
  var request;

  loadTimeline();

  function loadFeed(tweets) {
    $("#timeline").html("");
    $(tweets).each(function() {
      console.log(this.gsx$tweet.$t);
      var $tweet = $("<li>");
      $tweet.append("<img class='avi' src='https://twitter.com/" + this.gsx$username.$t + "/profile_image?size=bigger'>");
      $tweet.append("<span class='username'>" + this.gsx$username.$t + "</span><br>");
      $tweet.append(this.gsx$tweet.$t);
      $("#timeline").prepend($tweet);
    });
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
    // setup some local variables
    var $form = $(this);

    $("input[name='timestamp']").val(new Date().getTime());

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
});