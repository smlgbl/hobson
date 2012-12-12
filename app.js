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
	fs.readdir( __dirname + '/jobs', function( err, files ) {
		jobs = []
		for( var f in files ) {
			var file = files[f]
			if( file.substr( file.indexOf('.'), file.length ) == ".js" ) {
				var job = require('./jobs/' + file )
				if( job.enabled ) {
					jobs.push( job )
				}
			}
		}
	})
}

function callJobFuncs() {
	for( var j in jobs ) {
		var job = jobs[j]
		if( job.func ) {
			console.log( "Calling func of " + job.name)
			job.func( function( err, data ) {
				jobs[ j ].msg = data
				console.log( "Received data from " + jobs[ j ].name + ", namely: " + data )
			})
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
setInterval( callJobFuncs, 10000 )

