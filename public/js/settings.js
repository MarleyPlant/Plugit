$(function () {
  const defaults = [$("#prefix").val(), $("#token").val(), $("#message").val()];

  $(".btn-success").click(() => {
    const data = {
        prefix: $("#prefix").val(),
        token: $("#token").val(),
        clientid: $("#client_id").val(),
        clientsecret: $('#client_secret').val()
    };
    
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
