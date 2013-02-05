var request = require('request');
var jenkinsApi = require('../tools/jenkinsApi');
var configs = require('./config' + __filename.substring( __filename.lastIndexOf("/") ));
var commonJobInfoUrl = '/api/json';

var jen = {};
jen.setNewJobCallback = setNewJobCallback;
module.exports = jen;

var newJobCallback = function() {
	console.log( "Callback method hasn't been defined yet." );
};

function setNewJobCallback( callback ) {
	console.log("Setting callback");
	newJobCallback = callback;
}

configs.forEach( function( config ) {
	getJobsFromConfig( config );
});

function addJob( config ) {
	console.log( "Adding Job " + config.name );
	newJobCallback( config );
}

function jenkinsJob( config ) {
	this.name = config.name; //config.url.substring( config.url.lastIndexOf("/" + 1 ))
	this.url = config.url;
	this.msg = "Checking status ...";
	this.enabled = config.enabled;
	this.interval = config.interval;
	var self = this;
	this.func = function( callback ) {
		request( self.url.replace( /(http:\/\/)/, "$1" + config.user + ":" + config.pass + "@" ) + "lastBuild/api/json", function( err, resp, body ) {
				if( ! err ) {
					if( resp.statusCode == 200 && body.length > 0 ) {
						jenkinsApi.getMsg( JSON.parse( body ), function(data) { callback( null, data ); } );
					}
					if( resp.statusCode != 200 ) {
						this.msg = "Error fetching data: " + resp.statusCode;
						this.status = "failure";
						callback( null, { name: self.name, msg: self.msg, status: self.status, timestamp: new Date() } );
					}
				} else {
					console.log( "Error from " + self.name );
					console.log( err );
				}
		});
	};
}

function getJobsFromConfig( config ) {
	request( config.url.replace( /(http:\/\/)/, "$1" + config.user + ":" + config.pass + "@" ) + commonJobInfoUrl,
			function( err, resp, body ) {
				if( ! err ) {
					if( resp.statusCode == 200 && body.length > 0 ) {
						var jenkinsInfo = JSON.parse( body );
						if( jenkinsInfo.jobs && jenkinsInfo.jobs.length > 0 ) {
							console.log( "Getting jobs from " + config.url );
							if( typeof config.jobs === 'string' && config.jobs == 'all' ) {
								jenkinsInfo.jobs.forEach( function( j ) {
									var c = config;
									c.url = j.url;
									c.name = j.name;
									addJob( new jenkinsJob( c ) );
								});
							} else if( typeof config.jobs === 'object' && config.jobs.length > 0 ) {
								config.jobs.forEach( function( jobName ) {
									jenkinsInfo.jobs.some( function( j ) {
										if( j.name == jobName ) {
											var c = config;
											c.url = j.url;
											c.name = j.name;
											addJob( new jenkinsJob( c ) );
											return true;
										}
									});
								});
							} else {
								console.log( "Error in config. config.jobs is neither 'all' nor non-empty Array!");
							}
						}
					} else {
						console.log( "Error in request " + err );
					}
				}
			}
	);
}
