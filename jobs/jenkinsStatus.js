var request = require('request')
var user = 'username'
var pass = 'password'
var url = 'http://' + user + ':' + pass + '@ci.example.com/job/Unittests/lastBuild/api/json'

var Job = {}

module.exports = Job

Job.data = { msg: Job.msg, status: Job.status }
Job.name = 'Jenkins API'
Job.msg = 'Checking status ...'
Job.enabled = true
Job.status = 'building'
Job.interval = 30000
Job.timestamp = null
Job.func = function( callback ) {
	request( url, function( err, resp, body ) {
		if(!err && resp.statusCode == 200 ) {
			Job.msg = ''
			apiResp = JSON.parse( body, checkData )
		}
	})
	callback( null, { msg: Job.msg, status: Job.status, timestamp: Job.timestamp } )
}

function checkData( key, value ) {
	if( key ) {
		switch( key ) {
			case "building": 
				if( value && value == true ) Job.status = "building"
				break
			case "fullDisplayName":
				Job.name = value
				break
			case "result":
				if( value ) Job.status = value.toLowerCase()
				break
			case "msg":
				Job.msg += value 
				break
			case "author":
				if( value && typeof value === 'object' && value.fullName && typeof value.fullName === 'string' ) {
					if( Job.msg == '' )
						Job.msg = value.fullName + ": "
					else
						Job.msg = " by " + value.fullName
				}
				break
			case "timestamp":
				if( Job.timestamp && value && value > Job.timestamp )
					Job.timestamp = value
				break
		}
	}
	return value
}

