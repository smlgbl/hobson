module.exports = [
{
	user: 'username',
	pass: 'password',
	url: 'http://jenkins.example.com/jenkins/',
	jobs: [ 'Jobname_1', 'Jobname_2' ],
	enabled: true,
	interval: 30000
},
{
	user: 'username',
	pass: 'password',
	url: 'http://ci.example.com/',
	jobs: 'all',
	enabled: true,
	interval: 30000
},
{
	user: 'username',
	pass: 'password',
	url: 'http://ci.example2.com/',
	jobs: [ 'test', 'deploy' ],
	enabled: true,
	interval: 30000
}
]
