$(function() {
    prefix = $('#prefix').val();
    token = $('#token').val();
    message = $('#message').val();
    const defaults = [
        prefix,
        token,
        message
    ]

    $('.btn-success').click(() => {
        var prefix = $('#prefix').val();
        var token = $('#token').val();
        var message = $('#message').val();


        if (prefix !== defaults[0]) {
            console.log("Set Prefix Too", prefix);
        }
        if (token !== defaults[1]) {
            console.log("Set Token Too", token);
        }
        if (message !== defaults[2]) {
            console.log("Set Message Too", message);
        }
    })
});