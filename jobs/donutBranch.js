var request = require('request')
, jenkinsApi = require('../tools/jenkinsApi')
, config = require('./config' + __filename.substring( __filename.lastIndexOf("/") ))

var Job = {}

module.exports = Job

Job.name = 'Donut Branch'
Job.msg = 'Checking status ...'
Job.enabled = true
Job.status = 'building'
Job.interval = 30000
Job.timestamp = null
Job.data = { msg: Job.msg, status: Job.status, timestamp: Job.timestamp }
Job.func = function( callback ) {
	request( config.url.replace( /(http:\/\/)/, "$1" + config.user + ":" + config.pass + "@" ) + "/lastBuild/api/json"
			, function( err, resp, body ) {
		if(!err && resp.statusCode == 200 ) {
			jenkinsApi.getMsg( JSON.parse( body ), function(data) { callback( null, data ) } )
		}
		if( resp.statusCode != 200 ) {
			Job.msg = "Error fetching data: " + resp.statusCode
			Job.status = "failure"
		}
	})
	callback( null, Job.data )
}

