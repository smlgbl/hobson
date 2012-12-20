var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path'),
	helmet = require('helmet'),
	jobHandler = require('./jobHandler'),
	io = require('socket.io').listen(server)

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

io.sockets.on('connection', function( socket ) {
	console.log( "New connection from " + socket )
})

app.get('/', function(req, res) {
	res.render('index', 
		{ title: 'Jobs',
			jobArray: jobHandler.jobs
		}
	)
})

app.get('/detail/:id', function( req, res ) {
	if( req.params.id >= jobHandler.jobs.length ) {
		res.redirect('/')
	} else {
		res.render( 'detail', { title: "Job's details", job: jobHandler.jobs[ req.params.id ] } )
	}
})

app.get('/update', function( req, res ) {
	jobHandler.updateJobs()
	res.redirect('/')
})

jobHandler.setCallback( broadcastNews )
jobHandler.updateJobs()

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'))
	//process.setuid(config.uid)
	//process.setgid(config.gid)
})

function broadcastNews( data ) {
	io.sockets.emit( 'news', data )
}
