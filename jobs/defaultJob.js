var Job = {}

Job.name = 'Default Job #1'
Job.msg = 'This is the default job'
Job.enabled = true
Job.status = 'building'
Job.interval = 70000
Job.func = function( callback ) {
	var date = new Date()
	var msg = date.toString()
	var status = 'building'
	callback( null, { msg: msg, status: status } )
}

module.exports = Job
