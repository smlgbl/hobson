var nodeio = require('node.io')
var Job = {}

Job.data = 'Hi. My name is: 1'
Job.name = "Day's text"
Job.msg = 'day text'
Job.enabled = true
Job.data = 
Job.interval = 1000*60*60*24
Job.func = function( callback ) {
	var job  = new nodeio.Job({
		input:	[ new Date() ],
		run:	function( date ){
			var month = date.getMonth() + 1
			var today = date.getFullYear() + '/' + month  + '/' + date.getDate()

			this.getHtml( 
				'http://wol.jw.org/en/wol/dt/r1/lp-e/' + today,
				function( err, $ ) {
					if(err) {
						this.emit(err)
					} else {
						var t = $('p.sa').fulltext
//						var c = $('p.sb').fulltext
						this.emit( t )
//						this.emit( c )
					}
				}
			)
		}
	})
	
	nodeio.start( job, { silent: true }, callback, true)
}
module.exports = Job

