$(document).ready(function() {
  var curVolume = localStorage.getItem("volume");
  if (!curVolume) {
    curVolume = 50;
  }

  $("#volume").val(curVolume);

  $("#volume").change(function() {
    var val = $(this).val();
    $(".settings-container label v")
      .html(val + "%");
      localStorage.setItem("volume", val);
  });

  $("#volume").trigger("change");
});