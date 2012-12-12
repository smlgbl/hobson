var Job = {}

Job.data = 'Hi. My name is: 0'
Job.name = 'Default Job #1'
Job.msg = 'This is the default job'
Job.enabled = true
Job.data = 
Job.interval = 360000
Job.func = function() {
	var date = new Date()
	data += ' - ' + date.ToString()
}

module.exports = Job
