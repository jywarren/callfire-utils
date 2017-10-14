function onLogin(e) {
  e.preventDefault();
  var uid = $('#username').val();
  var secret = $('#password').val();
  utils.login(uid, secret, function onLoginComplete() {
    $('.btn').removeClass('disabled');
    $('#login').remove(); // this to trigger pwd saving; https://stackoverflow.com/questions/21191336/getting-chrome-to-prompt-to-save-password-when-using-ajax-to-login
    console.log('login complete');
  });
  console.log('logging in');
  return false;
}

// trigger getTexts via button, re-enable when done
function getTextsBtn(el) {
  $(el).addClass('disabled');
  utils.getTexts();
  $(el).removeClass('disabled');
}
