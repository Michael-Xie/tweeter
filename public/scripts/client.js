// Render tweets to display on webpage
const renderTweets = function(tweets) {
  for (tweet of tweets) {
    let createdElement = createTweetElement(tweet);
    $('#tweet-list').append(createdElement);
  }
};

// Generate html to create a tweet
const createTweetElement = function(tweet) {
  let $tweet = $('<article>').addClass('tweet');

  // Create header
  let $header = $('<header>');
  let $firstName = $('<span>').addClass('first-name');
  $firstName.append(tweet.user.name);
  let $photo = $('<img>').attr('src', tweet.user.avatars);
  let $photoName = $('<div>').addClass('photo-name');
  $photoName.append($photo);
  $photoName.append($firstName);

  let $handle = $('<span>').addClass('handle');
  $handle.append(tweet.user.handle);

  $header.append($photoName);
  $header.append($handle);

  // Create tweet context
  let $content = $('<p>').text(tweet.content.text);

  // Create footer
  let $footer = $('<footer>');
  let $timePassed = $('<span>').addClass('time-passed');
  $timePassed.append(formatTime(tweet.created_at));
  let $reaction = $('<span>').addClass('reaction');
  $reaction.append('⚑↹❤︎'); //↻
  $footer.append($timePassed);
  $footer.append($reaction);

  // Combine the parts to article
  $tweet.append($header);
  $tweet.append($content);
  $tweet.append($footer);
  return $tweet;
};

// A rendition of https://stackoverflow.com/questions/47253206/convert-milliseconds-to-timestamp-time-ago-59m-5d-3m-etc-in-javascript
// Return a string of the formated time with human readable units
const formatTime = function(timeCreated) {

  let diff = Math.floor((Date.now() - timeCreated) / 1000);
  let interval = Math.floor(diff / 31536000);

  if (interval >= 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(diff / 2592000);
  if (interval >= 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(diff / 604800);
  if (interval >= 1) {
    return `${interval} weeks ago`;
  }
  interval = Math.floor(diff / 86400);
  if (interval >= 1) {
    return `${interval} days ago`;
  }
  interval = Math.floor(diff / 3600);
  if (interval >= 1) {
    return `${interval} hours ago`;
  }
  interval = Math.floor(diff / 60);
  if (interval >= 1) {
    return `${interval} minutes ago`;
  }
  return "<1 minutes ago";
}

// A callback that sorts tweet data by created date from most current to least current
const sortData = function(data) {
  return data.sort(function(a, b) {
    if (a.created_at > b.created_at) {
      return -1;
    } else if (a.created_at < b.created_at) {
      return 1;
    } else {
      return 0;
    }
  });
};

// Load tweets to screen
const loadTweets = function() {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function(data) {
      // Show most current list of tweets
      deleteTweets();
      renderTweets(sortData(data));
    });
};

// Delete all tweets
const deleteTweets = function() {
  $(".tweet").remove();
};

$(document).ready(function() {
  loadTweets();
  $(".new-tweet").hide();
  $("#write-tweet").on("click", function() {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  });

  $(".error-message").slideUp(0);

  $("form").submit(function(event) {
    event.preventDefault();

    const maxLen = 140;
    // Show error message if user input doesn't satisfy tweet requirements
    if (this.children[0].value.trim().length > maxLen) {
      $(".error-message").text(`Please shorten your message. It is over 140 characters.`);
      $(".error-message").slideDown(0);

    } else if (this.children[0].value.trim().length === null || this.children[0].value.trim().length === 0) {
      $(".error-message").text(`Empty tweet not accepted.`);
      $(".error-message").slideDown(0);

    } else {
      // Perform AJAX post request of valid new tweet
      $.ajax("/tweets/", { method: "POST", data: $(this).serialize() })
        .done(function() {
          console.log("Ajax request successful");

          // Reset new tweet values and error message for next user input
          $("textarea").val("");
          $(".error-message").text("");
          $(".new-tweet span").text(maxLen);
          $(".error-message").slideUp(0);
          
          // Load newly written tweet to tweet-list
          loadTweets();
        });
    }
  });
});

