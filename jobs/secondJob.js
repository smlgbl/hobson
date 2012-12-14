var Job = {}

Job.data = 'Hi. My name is: 1'
Job.name = 'Default Job #2'
Job.msg = 'This is the second job'
Job.enabled = true
Job.status = 'building'
Job.interval = 10000
Job.func = function( callback ) {
	var date = new Date()
	var msg = date.toString()
	var status = 'failure'
	callback( null, { msg: msg, status: status } )
}

module.exports = Job

