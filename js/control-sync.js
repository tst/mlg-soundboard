// Synchronises the label for gain/drive with the sliders' current values
function checkStop (){
	console.log('stopOnChange: ' + stopOnChange);
}

$(document).ready(function(){
	console.log('start'); checkStop();
  $("[type=range]").change(function(){
  	if (stopOnChange){
    	stopPlaying();
    }

  	var rangeId = $(this).attr('id');
    var newVal= $(this).val();
    console.log("rangeId/newVal = " + rangeId + "/" + newVal);

    var newText = newVal && newVal == 100 ? "MAXIMUM DANK": (newVal || "error");

    $("span#" + rangeId + "Value").text(newText);
  });


  $("[type=checkbox]#stop").change(function(){
  	stopOnChange = $(this).is(':checked');
  });

  $("[type=checkbox]#overlap").change(function(){
  	allowOverlap = $(this).is(':checked');
  	if (!allowOverlap){
  		stopPlaying();
  	}
  });

});