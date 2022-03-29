function loginRally() {
  console.log('Logging in with rally..');
  $.ajax({
    method: 'POST',
    url: '/rally/register'
  }).done( (res) => {
    if (res) console.log('successfully registered application');
    window.open('/rally/auth', '_blank', 'popup, height=750px, width=1250px');
  });
}

function authenticateRally(data) {
  sessionStorage.setItem('rallyUserID', data.userID);
  sessionStorage.setItem('rallyNetworkID', data.networkID);
  sessionStorage.setItem('isCreator', data.isCreator);
  $('form#rallyLoginForm input#rallyUserID').val(data.userID);
  $('form#rallyLoginForm input#rallyNetworkID').val(data.networkID);
  $('form#rallyLoginForm input#isCreator').val(data.isCreator);
  $('form#rallyLoginForm').submit();
}

function loginCalendly() {

}

function authenticateCalendly() {

}

function refreshCalendly() {
  
}
