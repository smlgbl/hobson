var Job = {}

Job.data = 'Hi. My name is: 0'
Job.name = 'Default Job #1'
Job.msg = 'This is the default job'
Job.enabled = true
Job.data = ''
Job.status = 'building'
Job.interval = 70000
Job.func = function( callback ) {
	var date = new Date()
	var msg = ' - ' + date.toString()
	var status = 'success'
	callback( null, { msg: msg, status: status } )
}

module.exports = Job
