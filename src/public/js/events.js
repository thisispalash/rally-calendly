function populateSelectField(id) {
  $.ajax({
    method: 'GET',
    url: `/rally/nfts/${sessionStorage.isCreator}`
  }).then( (data) => {
    data.forEach((nft) => {
      $(`${id} select#nftOptions`)
        .append(`<option value="${nft.id}">${nft.title}</option>`);
    });
  });
  
  $.ajax({
    method: 'GET',
    url: `/calendly/events/${sessionStorage.calendlySlug}`
  }).then( (data) => {
    data.forEach((event) => {
      $(`${id} select#eventOptions`)
        .append(`<option value="${event.uri}">${event.name}</option>`);
    });
  });
}

function showCreatedEvents(token) {
  console.log(token)
  $.ajax({
    method: 'GET',
    url: `/events/get/${token}`
  }).then( (data) => {
    let html = '';
    $('#createdEventsList').html(''); // clear previous entries
    data.forEach( (event) => {
      html = '';
      html += '<div class="col-4 my-3 mx-3">'
      html += '<div class="card border-light bg-dark text-white">';
      html += '<div class="card-body">';
      html += `<h5 class="card-title">${event.name}</h5>`;
      if (event.gate == 'token') {
        html += `<p class="lead">Gated by ${event.qty} $${token}</p>`;
        html += `<button class="btn btn-large btn-outline-light" data-bs-toggle="modal" data-bs-target="#editEventModal" data-name=${event.name} data-gate=${event.gate} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id}>Edit</button>`;
      } else {
        html += `<p class="lead">Gated by ${event.qty} ${event.nft} NFTs</p>`;
        html += `<button class="btn btn-large btn-outline-light mx-2" data-bs-toggle="modal" data-bs-target="#editEventModal" data-name=${event.name} data-gate=${event.gate} data-nft=${event.nft} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id}>Edit</button>`;
      }
      html += `<button class="btn btn-large btn-outline-light mx-2" data-bs-toggle="modal" data-bs-target="#viewEventModal" data-eventID="${event._id}">View</button>`
      html += '</div>';
      html += '</div>';
      html += '</div>';
      $('#createdEventsList').append(html);
    });
  });
}

function showScheduledEvents(rallyUserID) {

}

function showGatedEvents(token) {

}
