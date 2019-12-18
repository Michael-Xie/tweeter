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
  console.log("link to avatar", tweet.user.avatars);
  let $photoName = $('<div>').addClass('photo-name');
  $photoName.append($photo);
  $photoName.append($firstName);

  let $handle = $('<span>').addClass('handle');
  $handle.append(tweet.user.handle);

  $header.append($photoName);
  $header.append($handle);

  // Create tweet context
  let $content = $('<p>').append(tweet.content.text);

  // Create footer
  let $footer = $('<footer>');
  let $timePassed = $('<span>').addClass('time-passed');
  console.log("time from file", tweet.created_at);
  $timePassed.append(formatTime(tweet.created_at));
  let $reaction = $('<span>').addClass('reaction');
  $reaction.append('⚑↹❤︎'); //↻
  $footer.append($timePassed);
  $footer.append($reaction);

  // Combine the parts to article
  $tweet.append($header);
  $tweet.append($content);
  $tweet.append($footer);
  console.log("creating tweet", $tweet);
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

const loadTweets = function () {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function (data) {
      renderTweets(data);;
    })

}
$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    $.ajax("/tweets/", { method: "POST", data: $(this).serialize() })
    .done(function() {
      console.log("Ajax request successful");
    });
  });
  loadTweets();
})

