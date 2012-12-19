var fs = require('fs')
var jobHandler = {}
jobHandler.jobs = []
jobHandler.updateJobs = updateJobs
jobHandler.getJobById = getJobById

module.exports = jobHandler

function updateJobs() {
	console.log("Updating Jobs ...")
	clearJobFuncSchedule()
	fs.readdir( __dirname + '/jobs', selectJobs )
}

function unrequire( moduleName ) {
	var jobDefName = require.resolve(moduleName)
	delete require.cache[ jobDefName ]
}

function selectJobs( err, files ) {
	jobHandler.jobs = []
	files.forEach( function( file ) {
		if( file.substr( file.indexOf('.'), file.length ) == ".js" ) {
			var name = './jobs/' + file
			unrequire( name )
			try {
				var newJobs = require( name )
			} catch(err) {
				console.log("Error loading " + file)
				return
			}
			if( ! Array.isArray( newJobs ) ) newJobs = [ newJobs ]
			newJobs.forEach( function( job ) {
				if( job.enabled ) {
					job.id = jobHandler.jobs.push( job ) - 1
				}
			})
		}
	})
	scheduleJobFuncs()
}

function scheduleJobFuncs() {
	jobHandler.jobs.forEach( function( job, index ) {
		if( job.func ) {
			job.func( callbackWrapper( index ) )
			if( job.interval ) {
				if( job.intervalId ) clearInterval( job.intervalId )
				job.intervalId = setInterval( job.func, job.interval, callbackWrapper( index ) )
			}
		}
	})
}

function clearJobFuncSchedule() {
	jobHandler.jobs.forEach( function( job ) {
		if( job.intervalId )
			clearInterval( job.intervalId )
	})
}

function callbackWrapper( jobNo ) {
	return function( err, data ) {
		Object.keys( data ).forEach( function( key ) {
			jobHandler.jobs[ jobNo ][ key ] = data[ key ]
		})
	}
}

function getJobById( id, callback ) {
	if( id >= jobHandler.jobs.length ) callback( null )
	else {
		jobHandler.jobs.some( function( job ) {
			if( job.id === id ) {
				console.log("Job " + job.name + " has id " + id )
				callback( job )
				return true
			}
		})
	}
}
