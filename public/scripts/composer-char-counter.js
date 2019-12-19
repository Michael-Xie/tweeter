$(document).ready(function () {
  // --- our code goes here ---
  console.log("hello");

  $(".new-tweet textarea").on("input", function (event) {
    const maxChar = 140;
    let currLen = $(this).val().length;

    let charLeft = maxChar - currLen;
    $(".new-tweet span").toggleClass('error', charLeft < 0)

    $(".new-tweet span").text(charLeft);
  })

});

