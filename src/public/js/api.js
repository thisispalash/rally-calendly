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

function loginCalendly() {
  console.log('logging into Calendly..');
  window.open('/calendly/auth', '_blank', 'popup, height=750px, width=1250px');
}