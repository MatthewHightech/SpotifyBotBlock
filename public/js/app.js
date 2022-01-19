const clientName = "specialized"
const website = "MattTest.com"
const email = "matt.smith@searchspring.com"
const rating = 10
const feedback = "This is Matt Testing Stuff and Things"

var url = "https://nebo-machine.vercel.app/nps"
			+"?name="+encodeURIComponent(clientName)
			+"&email="+encodeURIComponent(email)
			+"&website="+encodeURIComponent(website)
			+"&rating="+rating;
$.ajax({
	url: url
}).fail(function() {
	console.log("⚠️ NPS Rating Send to Nebo: Failed");
});
