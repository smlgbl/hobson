var shh = require('shh')
, configs = require('./config' + __filename.substring( __filename.lastIndexOf("/") ))

var Jobs = []
module.exports = Jobs

configs.forEach( function( config, index, array ) {
	Jobs.push( new sshJob( config ) )
})

function sshJob( config ) {
	this.name = config.host
	this.msg = "Checking status ..."
	this.enabled = true
	this.interval = 120000
	this.func = function( callback ) {
		var client = new shh.Client( {
			host: config.host,
			username: config.user
		} )

		client.connect( function() {
			client.exec('uptime', function( err, out ) {
				if( err ) {
					this.status = 'failure'
					this.msg = err
				} else {
					this.status = 'success'
					this.msg = out
				}
				client.close()
				callback( null, { name: this.name, msg: msg, status: status } )
			})
		})
	}

}

