module.exports = [
// minimal config to display status of all, no auth
{
	url: 'http://jenkins.example.com/jenkins/',
	jobs: 'all'
},
// config incl. auth
{
	user: 'username',
	pass: 'password',
	url: 'http://ci.example.com/',
	jobs: 'all'
},
// change request interval
{
	url: 'http://ci.example2.com/',
	jobs: [ 'test', 'deploy' ],
	interval: 30000
},
// disable temporarily
{
	url: 'http://ci.example2.com/',
	jobs: [ 'deploy-me' ],
	enabled: false
}
];
