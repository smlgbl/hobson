var request = require('request')
, jenkinsApi = require('../tools/jenkinsApi')
, configs = require('./config' + __filename.substring( __filename.lastIndexOf("/") ))

var Jobs = []
module.exports = Jobs
for( var c in configs ) {
	job = getJob( configs[c])
	Jobs.push( job )
}

function getJob( config ) {
		var Job = {}
		Job.url = config.url
		Job.msg = 'Checking status ...'
		Job.enabled = config.enabled
		Job.interval = config.interval
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
					callback( null, { msg: Job.msg, status: Job.status } )
				}
			})
		}
		return Job
	}

