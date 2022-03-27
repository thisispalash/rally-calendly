function showCreatedEvents(token) {
  $.ajax({
    method: 'GET',
    url: `/events/get/${token}`
  }).then( (data) => {
    console.log(data);
    let html = '';
    $('#createdEventsDiv').html(''); // clear previous entries
    data.forEach( (event) => {
      html += '<div class="card bg-dark text-white my-3">';
      html += '<div class="card-body">';
      html += `<h5 class="card-title">${event.name}</h5>`;
      if (event.gate == 'token') {
        html += `<p class="lead">Gated by ${event.qty} $${token}</p>`;
        html += `<button class="btn btn-large btn-outline-light" data-bs-toggle="modal" data-bs-target="#editEventModal" data-name=${event.name} data-gate=${event.gate} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id}>Edit</button`;
      } else {
        html += `<p class="lead">Gated by ${event.qty} ${event.nft} NFTs</p>`;
        html += `<button class="btn btn-large btn-outline-light" data-bs-toggle="modal" data-bs-target="#editEventModal" data-name=${event.name} data-gate=${event.gate} data-nft=${event.nft} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id}>Edit</button`;
      }
      html += '</div>';
      html += '</div>';
      $('#createdEventsDiv').append(html);
    });
  });
}

function showGatedEvents(token) {
  $.ajax({
    method: 'GET',
    url: `/events/all/${token}`
  }).then( (data) => {
    console.log(data);
    let html = '';
    $('#gatedEventsDiv').html(''); // clear previous entries
    data.forEach( (event) => {
      html += '<div class="card bg-dark text-white my-3">';
      html += '<div class="card-body">';
      html += `<h5 class="card-title">${event.name}</h5>`;
      if (event.gate == 'token') {
        html += `<p class="lead">Gated by ${event.qty} $${token}</p>`;
        html += `<button class="btn btn-large btn-outline-light" data-bs-toggle="modal" data-bs-target="#scheduleEventModal" data-name=${event.name} data-gate=${event.gate} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id} data-token=${event.token}>Schedule</button`;
      } else {
        html += `<p class="lead">Gated by ${event.qty} ${event.nft} NFTs</p>`;
        // TODO figure out button
        html += `<button class="btn btn-large btn-outline-light" data-bs-toggle="modal" data-bs-target="#scheduleEventModal" data-name=${event.name} data-gate=${event.gate} data-nft=${event.nft} data-qty=${event.qty} data-calendly=${event.calendly} data-eventID=${event._id} data-token=${event.token}>Schedule</button`;
      }
      html += '</div>';
      html += '</div>';
      $('#gatedEventsDiv').append(html);
    });
  });

}

function prePopuluateEventForms() {
  $.ajax({
    method: 'GET',
    url: `/rally/nfts/${sessionStorage.isCreator}`
  }).then( (data) => {
    data.forEach((nft) => {
      $('#createNewEventModalBody select#nftOptions')
        .append(`<option value="${nft.id}">${nft.title}</option>`);
      $('#editEventModalBody select#nftOptions')
        .append(`<option value="${nft.id}">${nft.title}</option>`);
    });
  });
  
  $.ajax({
    method: 'GET',
    url: `/calendly/events/${sessionStorage.calendlySlug}`
  }).then( (data) => {
    data.forEach((event) => {
      $('#createNewEventModalBody select#eventOptions')
        .append(`<option value="${event.uri}">${event.name}</option>`);
      $('#editEventModalBody select#eventOptions')
        .append(`<option value="${event.uri}">${event.name}</option>`);
    });
  });
}
