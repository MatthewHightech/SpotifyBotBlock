// const clientName = "specialized"
// const website = "MattTest.com"
// const email = "matt.smith@searchspring.com"
// const rating = 10
// const feedback = "This is Matt Testing Stuff and Things"

// var url = "https://nebo-machine.vercel.app/nps"
// 			+"?name="+encodeURIComponent(clientName)
// 			+"&email="+encodeURIComponent(email)
// 			+"&website="+encodeURIComponent(website)
// 			+"&rating="+rating;
// $.ajax({
// 	url: url
// }).fail(function() {
// 	console.log("⚠️ NPS Rating Send to Nebo: Failed");
// });

(function() {

	const OWNERID = "kaptinkirk_";
	let playlists = [];
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */
	function getHashParams() {
	  var hashParams = {};
	  var e, r = /([^&;=]+)=?([^&;]*)/g,
		  q = window.location.hash.substring(1);
	  while ( e = r.exec(q)) {
		 hashParams[e[1]] = decodeURIComponent(e[2]);
	  }
	  return hashParams;
	}

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('user-profile');

	var oauthSource = document.getElementById('oauth-template').innerHTML,
		oauthTemplate = Handlebars.compile(oauthSource),
		oauthPlaceholder = document.getElementById('oauth');

	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
	  alert('There was an error during the authentication');
	} else {
	  if (access_token) {
		// render oauth info
		oauthPlaceholder.innerHTML = oauthTemplate({
		  access_token: access_token,
		  refresh_token: refresh_token
		});

		// user data
		$.ajax({
			url: 'https://api.spotify.com/v1/me',
			headers: {
			  'Authorization': 'Bearer ' + access_token
			},
			success: function(response) {
			  userProfilePlaceholder.innerHTML = userProfileTemplate(response);

			  $('#login').hide();
			  $('#loggedin').show();
			}
		});
		// user playlists
		$.ajax({
			url: 'https://api.spotify.com/v1/users/'+OWNERID+'/playlists?limit=30',
			headers: {
			  'Authorization': 'Bearer ' + access_token
			},
			success: function(response) {
				console.log("Successful playlist request", response)
				response.items.forEach(element => {
					if (element.collaborative && element.owner.id == OWNERID) {
						createPlaylistItem(element);
						console.log(element);
						playlists.push(element);
					}
				});
			}
		});

	  } else {
		  // render initial screen
		  $('#login').show();
		  $('#loggedin').hide();
	  }

	  document.getElementById('obtain-new-token').addEventListener('click', function() {
		$.ajax({
		  url: '/refresh_token',
		  data: {
			'refresh_token': refresh_token
		  }
		}).done(function(data) {
		  access_token = data.access_token;
		  oauthPlaceholder.innerHTML = oauthTemplate({
			access_token: access_token,
			refresh_token: refresh_token
		  });
		});
	  }, false);

	  document.getElementById('removeSongs').addEventListener('click', function() {
		$.ajax({
		  url: '/refresh_token',
		  data: {
			'refresh_token': refresh_token
		  }
		}).done(function(data) {
		  access_token = data.access_token;
		  oauthPlaceholder.innerHTML = oauthTemplate({
			access_token: access_token,
			refresh_token: refresh_token
		  });
		});
	  }, false);
	}
  })();

  function createPlaylistItem(item) {

	const list = document.getElementById('list');
	let li = document.createElement('li');
	li.innerHTML = item.name;
	list.appendChild(li);

  }