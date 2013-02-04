var fs = require('fs');
var jobHandler = {};
jobHandler.jobs = [];
jobHandler.updateJobs = updateJobsFromFile;
//jobHandler.getJobById = getJobById;
jobHandler.callback = function() {};
jobHandler.setCallback = setCallback;
//jobHandler.addJob = addJob;

module.exports = jobHandler;

function setCallback( callback ) {
	jobHandler.callback = callback;
}

function updateJobsFromFile() {
	clearJobFuncSchedule();
	fs.readdir( __dirname + '/jobs', selectJobs );
}

function unrequire( moduleName ) {
	var jobDefName = require.resolve(moduleName);
	delete require.cache[ jobDefName ];
}

function selectJobs( err, files ) {
	jobHandler.jobs = []
	files.forEach( function( file ) {
		if( file.substr( file.indexOf('.'), file.length ) == ".js" ) {
			console.log( "Reading file " + file );
			var name = './jobs/' + file;
			var newJobs;
			unrequire( name );
			try {
				var newJobsDef = require( name );
				if( newJobsDef.setNewJobCallback ) {
					if( newJobsDef.setNewJobCallback && typeof newJobsDef.setNewJobCallback === 'function' ) {
						newJobsDef.setNewJobCallback( addJob );
					}
				} else {
					newJobs = newJobsDef;
					if( ! Array.isArray( newJobs ) ) {
						newJobs = [ newJobs ];
					}
					if( newJobs.length ) {
						newJobs.forEach( function( job ) {
							console.log( "Adding Job from Array: " + job.name + " - " + file );
							addJob( job );
						});
					}
				}
			} catch(err) {
				console.log("Error loading " + file);
				console.log( err );
				return
			}
		}
	});
}

function addJobExec( job, index ) {
	if( job.func ) {
		job.func( callbackWrapper( index ) );
		if( job.interval ) {
			if( job.intervalId ) clearInterval( job.intervalId )
				job.intervalId = setInterval( job.func, job.interval, callbackWrapper( index ) );
		}
	}
}

function addJob( job ) {
	if( job.enabled ) {
		job.id = jobHandler.jobs.push( job ) - 1;
		addJobExec( job, job.id );
	}
}

function clearJobFuncSchedule() {
	jobHandler.jobs.forEach( function( job ) {
		if( job.intervalId )
			clearInterval( job.intervalId );
	});
}

function callbackWrapper( jobNo ) {
	return function( err, data ) {
		if( ! err ) {
			var news = false;
			Object.keys( data ).forEach( function( key ) {
				var oldData = jobHandler.jobs[ jobNo ][ key ];
				var newData = data[ key ];
				if( newData && (
					( ! oldData && newData.length ) 
					|| ( oldData && oldData != newData && newData.length ) ) ) {
						news = true;
						jobHandler.jobs[ jobNo ][ key ] = newData;
					}
			});
			if( news )
				jobHandler.callback( jobHandler.jobs[ jobNo ] );
		} else {
			console.log( "Error in callbackWrapper: " + err );
		}
	}
}

function getJobById( id, callback ) {
	if( id >= jobHandler.jobs.length ) callback( null );
	else {
		jobHandler.jobs.some( function( job ) {
			if( job.id === id ) {
				console.log("Job " + job.name + " has id " + id );
				callback( job );
				return true;
			}
		})
	}
}
