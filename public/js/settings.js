$(function () {
  const defaults = [$("#prefix").val(), $("#token").val(), $("#message").val()];

  $(".btn-success").click(() => {
    const data = {
        prefix: $("#prefix").val(),
        token: $("#token").val(),
    };

    if (data['prefix'] !== defaults[0]) {
      console.log("Set Prefix Too", data['prefix']);
    }
    if (data['token'] !== defaults[1]) {
      console.log("Set Token Too", data['token'])
    }
    if (data['message'] !== defaults[2]) {
      console.log("Set Message Too", data['message']);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:5000/settings/update/', true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
      // done
    };
  });
});
