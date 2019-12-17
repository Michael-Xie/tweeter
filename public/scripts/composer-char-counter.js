$(document).ready(function() {
  // --- our code goes here ---
  console.log("hello");

  $(".new-tweet textarea").on("input", function(event){
    const maxChar = 140;
    let currLen = $(this).val().length;

    let charLeft = maxChar - currLen;
    console.log(currLen);
    if (charLeft < 0) {
      $(".new-tweet span").css("color", "red");
    } else {
      $(".new-tweet span").css("color", "black");
    }

    $(".new-tweet span").text(charLeft);
    })

});

