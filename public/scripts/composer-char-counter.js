$(document).ready(function () {
  $(".new-tweet textarea").on("input", function (event) {
    const maxChar = 140;
    // current length shouldn't count trailing whitespaces
    let currLen = $(this).val().trim().length;

    let charLeft = maxChar - currLen;
    $(".new-tweet span").toggleClass('error', charLeft < 0)

    $(".new-tweet span").text(charLeft);
  })

});

