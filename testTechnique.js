// Phantombuster configuration {

"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster flags: save-folder" // Save all files at the end of the script

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick()

// }

// Simple scraping function, getting all the infos using jQuery and returning them with the callback "done"
const scrape = (arg, done) => {
	var data = $("div.list-group > div.clearfix").map(function () {
		return({
			name: $(this).find("h4.mb-1").text().trim(),
			stand: $(this).find("span.badge.badge-info").text().trim(),
			site: $(this).find("a.btn.btn-success.btn-sm.float-right.mr-1").attr("href"),
			url: $(this).find("a.btn.btn-success.btn-sm.float-right").attr("href")
			
			
		})
	})
	done(null, $.makeArray(data))
}

;(async () => {
	// Create a new tab in your browser
	const tab = await nick.newTab()
	// Open the webpage
	await tab.open("http://ext.salonsiane.com/ListeDesExposants/")
	// Wait for the data to be visible
	await tab.waitUntilVisible(".list-group")
	// Inject jQuery to manipulate the page easily
	await tab.inject("../injectables/jquery-3.0.0.min.js")
	// Launch the scrape function in the page context
	const result = await tab.evaluate(scrape)
	// Take a screenshot of the whole page
	await tab.screenshot("screenshot.jpg")
	// Send the data in the result object
	await buster.setResultObject(result)
	// Exit the programm without errors
	nick.exit()
})()
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	// Exit the programm with errors
	nick.exit(1)
})

