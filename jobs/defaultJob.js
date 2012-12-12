var Job = {}

Job.data = 'Hi. My name is: 0'
Job.name = 'Default Job #1'
Job.msg = 'This is the default job'
Job.enabled = false
Job.data = ''
Job.interval = 360000
Job.func = function( callback ) {
	var date = new Date()
	Job.data += ' - ' + date.toString()
	callback( Job.data )
}

module.exports = Job