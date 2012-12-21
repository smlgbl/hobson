var API = {}
module.exports = API

API.getMsg = function( json, callback ) {
	var changes = []
	var user = ''
	var branch = ''
	var node = ''
	var msg = ''
	var msg2 = ''
	var status = ''
	var timestamp = ''
	var name = ''

	// in our setup, the first two of these if's should be mutually exclusive ... I might be wrong, though
	if( 
		json.changeSet 
		&& typeof json.changeSet === 'object' 
		&& json.changeSet.items 
		&& typeof json.changeSet.items === 'object' 
		&& Array.isArray( json.changeSet.items )
	) {
		json.changeSet.items.forEach( function( cs ) {
			if( 
				  cs.user 
				  && typeof cs.user === 'string' 
			) {
				cUser = cs.user
			} else if ( 
				cs.author 
				&& typeof cs.author === 'object' 
				&& cs.author.fullName 
				&& typeof cs.author.fullName === 'string' 
			) {
				cUser = cs.author.fullName
			}
			changes.push( cUser + ": " + cs.msg)
		})
	}
	if( 
		json.actions 
		&& typeof json.actions === 'object' 
		&& Array.isArray( json.actions ) 
	) {
		json.actions.forEach( function( xvalue ) {
			Object.keys( xvalue ).forEach( function( m ) {
				var mvalue = xvalue[ m ]
				switch( m ) {
					case "parameters":
						if( mvalue && Array.isArray( mvalue ) ) {
							mvalue.forEach( function( yvalue ) {
								if( yvalue 
									&& yvalue.name 
									&& ( yvalue.name == "SVN_BRANCH" || yvalue.name == "BRANCH" ) 
									&& yvalue.value 
									&& typeof yvalue.value 
								) {
									  branch = yvalue.value.replace( /(branches\/)|(origin\/)/g, '' )
								}
							})
						}
						break
					case "causes":
						if( mvalue && Array.isArray( mvalue ) ) {
							mvalue.forEach( function( zvalue ) {
								if( 
									zvalue
									&& zvalue.userName
									&& typeof zvalue.userName === 'string'
								) {
									user = zvalue.userName
								}
							})
						}
						break
				}
			})
		})
	}
	if( json.builtOn
		&& typeof json.builtOn === 'string'
		&& json.builtOn.length > 0
	) {
		node = json.builtOn
	}

	// Now build a meaningful string
	var linebreak = '<br />'
	
	if( changes.length > 0 && changes.length < 3 ) {
		msg = changes.join( linebreak )
	} else if( changes.length >= 3 ) {
		msg = changes.slice( 0, 3 ).join( linebreak )
		msg2 = changes.slice( 3 ).join( linebreak )
	}
	
	if( json.result && typeof json.result === 'string' )
		status = json.result.toLowerCase()
	else if( json.building && json.building === true ) {
		status = "building"
		if( msg === '' ) msg = "Building ..."
	}
	
	// user overrides changes ...
	if( user.length > 0 && branch.length ){
		var verb = " built "
		if( json.building )
			verb = " is building "
		msg = user + verb + branch
		if( node.length > 0 )
			msg += " on " + node
	}

	if( json.fullDisplayName && typeof json.fullDisplayName === 'string' )
		name = json.fullDisplayName
	
	if( json.timestamp && typeof json.timestamp === 'string' )
		timestamp = json.timestamp
	
	callback( {
		name: name,
		msg: msg,
		msg2: msg2,
		status: status,
		timestamp: timestamp
	} )
}
