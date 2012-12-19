var express = require('express'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	MemoryStore = express.session.MemoryStore,
	helmet = require('helmet')

var app = express()

app.configure(function(){
	app.set('port', process.env.PORT || 3000)
	app.set('views', __dirname + '/views')
	app.set('view engine', 'jade')
	app.use(express.favicon())
	app.use(express.logger('dev'))
	app.use(helmet.xframe())
	app.use(helmet.iexss())
	app.use(helmet.contentTypeOptions())
	app.use(helmet.cacheControl())
	app.use(express.bodyParser())
	app.use(express.methodOverride())
	app.use(express.cookieParser())
	app.use(express.session({
		secret: "notagoodsecret",
		cookie: {httpOnly: true, secure: true},
	}))
	app.use(express.csrf())

	app.use(function (req, res, next) {
		res.locals.csrftoken = req.session._csrf
		next()
	})

	app.use(app.router)
	app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
	app.use(express.errorHandler())
})

var jobs = []

function updateJobs() {
	console.log("Updating Jobs ...")
	clearJobFuncSchedule()
	fs.readdir( __dirname + '/jobs', selectJobs )
}

function unrequire( moduleName ) {
	var jobDefName = require.resolve(moduleName)
	delete require.cache[ jobDefName ]
}

function selectJobs( err, files ) {
	jobs = []
	for( var f in files ) {
		var file = files[f]
		if( file.substr( file.indexOf('.'), file.length ) == ".js" ) {
			var name = './jobs/' + file
			unrequire( name )
			var newJobs = require( name )
			if( ! Array.isArray( newJobs ) ) newJobs = [ newJobs ]
			for( var j in newJobs ) {
				var job = newJobs[ j ]
				if( job.enabled ) {
					job.id = jobs.push( job )
				}
			}
		}
	}
	scheduleJobFuncs()
}

function scheduleJobFuncs() {
	for( var j in jobs ) {
		var job = jobs[j]
		if( job.func ) {
			job.func( callbackWrapper( j ) )
			if( job.interval ) {
				if( job.intervalId ) clearInterval( job.intervalId )
				job.intervalId = setInterval( job.func, job.interval, callbackWrapper( j ) )
			}
		}
	}
}

function clearJobFuncSchedule() {
	for( var j in jobs ) {
		var job = jobs[j]
		if( job.intervalId )
			clearInterval( job.intervalId )
	}
}

function callbackWrapper( jobNo ) {
	return function( err, data ) {
		var keys = Object.keys( data )
		for( var k in keys ) {
			key = keys[ k ]
			jobs[ jobNo ][ key ] = data[ key ]
		}
	}
}

app.get('/', function(req, res) {
	res.render('index', 
		{ title: 'Jobs',
			jobArray: jobs
		}
	)
})

app.get('/update', function( req, res ) {
	updateJobs()
	res.redirect('/')
})

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'))
	//process.setuid(config.uid)
	//process.setgid(config.gid)
})

updateJobs()
