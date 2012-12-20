var request = require('request')
, jenkinsApi = require('../tools/jenkinsApi')
, configs = require('./config' + __filename.substring( __filename.lastIndexOf("/") ))

var Jobs = []
module.exports = Jobs

configs.forEach( function( config, index, array ) {
	Jobs.push( new jenkinsJob( config ) )
})

function jenkinsJob( config ) {
	this.name = config.url.substring( config.url.lastIndexOf("/" + 1 ))
	this.url = config.url
	this.msg = "Checking status ..."
	this.enabled = config.enabled
	this.interval = config.interval
	this.func = function( callback ) {
		request( config.url.replace( /(http:\/\/)/, "$1" + config.user + ":" + config.pass + "@" ) + "/lastBuild/api/json"
			, function( err, resp, body ) {
			if(!err && resp.statusCode == 200 ) {
				jenkinsApi.getMsg( JSON.parse( body ), function(data) { callback( null, data ) } )
			}
			if( resp.statusCode != 200 ) {
				this.msg = "Error fetching data: " + resp.statusCode
				this.status = "failure"
				callback( null, { msg: this.msg, status: this.status, timestamp: new Date() } )
			}
		})
	}

}
