var Job = {}

Job.data = 'Hi. My name is: 1'
Job.name = 'Default Job #2'
Job.msg = 'This is the second job'
Job.enabled = true
Job.data = ''
Job.interval = 360000
Job.func = function( callback ) {
	var date = new Date()
	Job.data += ' - ' + date.toString()
	callback( null, Job.data )
}

module.exports = Job

