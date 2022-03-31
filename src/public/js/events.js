function populateSelectField(id) {
  $.ajax({
    method: 'GET',
    url: `/rally/nfts/${sessionStorage.isCreator}`
  }).then( (data) => {
    $(`${id} select#nftOptions`)
      .empty()
      .append(`<option value="">Select a NFT as gatekeeper</option>`)
    data.forEach((nft) => {
      $(`${id} select#nftOptions`)
        .append(`<option value="${nft.id}">${nft.title}</option>`);
    });
  });
  
  $.ajax({
    method: 'GET',
    url: `/calendly/events/${sessionStorage.calendlySlug}`
  }).then( (data) => {
    $(`${id} select#eventOptions`)
      .empty()
      .append(`<option value="">Select the Calendly Event dedicated for the meet</option>`);
    data.forEach((event) => {
      $(`${id} select#eventOptions`)
        .append(`<option value="${event.uri}">${event.name}</option>`);
    });
  });
}

function showCreatedEvents(token) {
  $.ajax({
    method: 'GET',
    url: `/events/get/${token}`
  }).then( (data) => {
    let html = '';
    if (!data.length) {
      $('#createdEventsList').html('<p class="lead">No events created.</p>');
    } else {
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
          html += `<p class="lead">Gated by NFT ID ${event.nft}</p>`;
          html += `<button class="btn btn-large btn-outline-light mx-2" data-bs-toggle="modal" data-bs-target="#editEventModal" data-name=${event.name} data-gate=${event.gate} data-nft=${event.nft} data-calendly=${event.calendly} data-eventID=${event._id}>Edit</button>`;
        }
        html += `<button class="btn btn-large btn-outline-light mx-2" data-bs-toggle="modal" data-bs-target="#viewEventModal" data-eventID="${event._id}">View</button>`
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#createdEventsList').append(html);
      });
    }
  });
}

function showScheduledEvents(rallyUserID) {
  $.ajax({
    method: 'GET',
    url: `/events/scheduled/${rallyUserID}`
  }).then( (data) => {
    let html = '';
    if (!data.length) {
      $('#scheduledEventsList').html('<p class="lead">No events scheduled.</p>');
    } else {
      $('#scheduledEventsList').html(''); // clear previous entries
      data.forEach( (event) => {
        html = '';

        html += '<div class="col-4 my-3 mx-3">'
        html += '<div class="card border-light bg-dark text-white">';
        html += '<div class="card-body">';
        html += `<h5 class="card-title">${event.eventID}</h5>`;
        html += `<p class="lead">Event UUID: ${event.schedule}</p>`;
        html += `<p class="lead">Attendee UUID: ${event.invitee}</p>`;
        html += `<button class="btn btn-large btn-outline-light mx-2" data-bs-toggle="modal" data-bs-target="#viewEventModal" data-eventid=${event._id} data-schedule=${event.schedule} data-invitee=${event.invitee}>View</button>`
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $('#scheduledEventsList').append(html);
      });
    }
  })

}

function showGatedEvents(token) {
  $.ajax({
    method: 'GET',
    url: `/events/all/${token}`
  }).then( (data) => {
    let html = '';
    if (!data.length) {
      $('#scheduleEventModal #gatedEventList').html('No events available to book.');
    } else {
      $('#scheduleEventModal #gatedEventList').html(''); // clear previous entries
      data.forEach( (event) => {
        html = '';
        html += `<div class="my-3 mx-3" data-token=${event.token}>`
        html += '<div class="card border-light bg-dark text-white">';
        html += '<div class="row g-0">';
        html += '<div class="col-9 d-flex align-items-center justify-content-center">';
        html += '<div class="card-body">';
        html += `<h5 class="card-title">${event.name}</h5>`;
        if (event.gate == 'token') {
          html += `<p class="lead">Gated by ${event.qty} $${event.token}</p>`;
        } else {
          html += `<p class="lead">Gated by NFT ID ${event.nft}</p>`;
        }
        html += '</div>';
        html += '</div>';
        html += '<div class="col-3 d-flex align-items-center justify-content-center">';
        if (event.gate === 'token') {
          html += `<button class="btn btn-large btn-outline-light" data-eventid=${event._id} data-gate=${event.gate} data-token=${event.token} data-qty=${event.qty} onclick="scheduleEvent(this)">Schedule</button>`
        } else {
          html += `<button class="btn btn-large btn-outline-light" data-eventid=${event._id} data-gate=${event.gate} data-nft=${event.nft} onclick="scheduleEvent(this)">Schedule</button>`
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#scheduleEventModal #gatedEventList').append(html);
     });
    }
  });
}
