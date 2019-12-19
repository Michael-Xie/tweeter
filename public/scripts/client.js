// Fake data taken from initial-tweets.json
// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd"
//     },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

const renderTweets = function (tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container

  for (tweet of tweets) {
    let createdElement = createTweetElement(tweet);
    $('#tweet-list').append(createdElement);
  }
}

const createTweetElement = function (tweet) {
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
}

// A rendition of https://stackoverflow.com/questions/47253206/convert-milliseconds-to-timestamp-time-ago-59m-5d-3m-etc-in-javascript
function formatTime(timeCreated) {

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

const sortData = function (data) {
  return data.sort(function (a, b) {
    if (a.created_at > b.created_at) {
      return -1;
    } else if (a.created_at < b.created_at) {
      return 1;
    } else {
      return 0;
    }
  });
}
const loadTweets = function () {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function (data) {
      deleteTweets();
      renderTweets(sortData(data));
    })

}

const deleteTweets = function () {
  $(".tweet").remove();
}

// const escape =  function(str) {
//   let div = document.createElement('div');
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// }

$(document).ready(function () {
  loadTweets();
  $(".new-tweet").hide();
  $("#write-tweet").on("click", function () {
    $(".new-tweet").slideToggle();
    $(".new-tweet textarea").focus();
  });

  $(".error-message").slideUp(0);

  $("form").submit(function (event) {
    event.preventDefault();
    const maxLen = 140;
    // console.log(value);
    // console.log(this.children[0].value);

    if (this.children[0].value.length > maxLen) {
      $(".error-message").text(`Please shorten your message. It is over 140 characters.`);
      $(".error-message").slideDown(0);

    } else if (this.children[0].value.length === null || this.children[0].value.length === 0) {
      $(".error-message").text(`Empty tweet not accepted.`);
      $(".error-message").slideDown(0);

    } else {
      $.ajax("/tweets/", { method: "POST", data: $(this).serialize() })
        .done(function () {
          console.log("Ajax request successful");
          $("textarea").val("");
          $(".error-message").text("");
          $(".new-tweet span").text(maxLen);
          $(".error-message").slideUp(0);

          loadTweets();
        });
    }
  });
})

