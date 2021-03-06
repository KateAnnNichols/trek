const tripsUrl = 'https://trektravel.herokuapp.com/trips';

const displayStatus = (message) => {
    $('#status').html(message);
  };
  
const reportError = (message, errors) => {
  let content = `<p>${message}</p><ul>`;
  for (const field in errors) {
    for (const problem of errors[field]) {
      content += `<li>${field}: ${problem}</li>`;
    }
  }
  content += "</ul>";
  reportStatus(content);
};

const showTripDetails = id => {
  const detailsUrl = tripsUrl + `/${id}`;
  axios.get(detailsUrl)
    .then(function(response) {
        const trip = response.data;
        let info = `<h3> ${trip.name}</h2>
        <p>${trip.about}</p>
        <ul>
        <li><b>Continent</b>: ${trip.continent}</li>
        <li><b>Category</b>: ${trip.category}</li>
        <li><b>Duration</b>: ${trip.weeks} weeks</li>
        <li><b>Cost</b>: $${trip.cost}</li>
        <li><b>Trip ID</b>: <span id="trip-id">${trip.id}</span></li>
        </ul>`;
        $("#trip-info").append(info);
        $(document).scrollTop(0);
        $('.trip-details').show();
      })
    .catch(function(error) {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
          );
      } else {
          reportStatus(`Encountered an error: ${error.message}`);
        }
      });
  };

const loadTrips = () => {
  // displayStatus('Loading trips...');
  const tripList = $('#trip-list');
  tripList.empty();
  $("#trip-info").empty();
  tripList.append(`<h2>All Trips</h2>`);
  axios.get(tripsUrl)
    .then(function (response) {
      response.data.forEach((trip) => {
          tripList.append(`<li><a href="" class="trip-link" id="${trip.id}">${trip.name}</a></li>`);
      });
      console.log(response);
      $('.flex-container').css('display', 'flex');
      })
    .catch(function (error) {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
          );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }  
    });   
  }

const reserveTrip = (trip) => {
  console.log("reserving trip", trip)
}

$(document).on('submit', 'form', event => {
  event.preventDefault();
  console.log("running submit");
  const trip_id = $("#trip-id").text();
  const formData = {
    trip_id: trip_id,
    name: $("#your-name").val(),
    email: $("#email").val()
  };
  console.log(formData);
  const resvUrl = tripsUrl + `/${trip_id}/reservations`;
  axios
    .post(resvUrl, formData)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
  $('input').val('');
});

$(document).on("click", "a", event => {
  event.preventDefault();
  $("#trip-info").empty();
  const id = $(event.target).attr("id");
  console.log("loading " + id);
  showTripDetails(id);
});

$(document).on("click", "#load-trips", event => {
  $('.trip-details').hide();
  loadTrips();
});

$(document).ready(() => {  
  $('.trip-details').hide();
  $('#load-trips').click(loadTrips);
}) 