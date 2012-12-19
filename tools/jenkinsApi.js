var API = {}
module.exports = API

API.getMsg = function( json, callback ) {
	var changes = []
	var user = ''
	var branch = ''
	var node = ''
	var msg = ''
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
		  for( var c in json.changeSet.items ) {
			  var cs = json.changeSet.items[c]
			  if( cs.user && typeof cs.user === 'string' ) {
				  cUser = cs.user
			  } else if ( cs.author && typeof cs.author === 'object' && cs.author.fullName && typeof cs.author.fullName === 'string' ) {
				  cUser = cs.author.fullName
			  }
			  changes.push( cUser + ": " + cs.msg)
		  }
	}
	if( 
		json.actions 
		&& typeof json.actions === 'object' 
		&& Array.isArray( json.actions ) 
	) {
		for( var x in json.actions ) {
			var xvalue = json.actions[x]
			for( var m in xvalue ) {
				var mvalue = xvalue[m]
				switch( m ) {
					case "parameters":
						if( mvalue && Array.isArray( mvalue ) ) {
							for( var y in mvalue ) {
								var yvalue = mvalue[ y ]
								if( yvalue 
										&& yvalue.name 
										&& ( yvalue.name == "SVN_BRANCH" || yvalue.name == "BRANCH" ) 
										&& yvalue.value 
										&& typeof yvalue.value 
								  ) {
									  branch = yvalue.value.replace( /(branches\/)|(origin\/)/g, '' )
								  }
							}
						}
						break
					case "causes":
						if( mvalue && Array.isArray( mvalue ) ) {
							for( var z in mvalue ) {
								var zvalue = mvalue[ z ]
								if( 
										zvalue
										&& zvalue.userName
										&& typeof zvalue.userName === 'string'
								) {
									  user = zvalue.userName
								}
							}
						}
						break
				}
			}
		}
	}
	if( json.builtOn
		&& typeof json.builtOn === 'string'
		&& json.builtOn.length > 0
	) {
		node = json.builtOn
	}

	// Now build a meaningful string
	
	if( changes.length > 0 ) {
		msg = changes.join('<br />')
	} else if( user.length > 0 ){
		msg = user + " built " + branch
		if( node.length > 0 )
			msg += " on " + node
	}

	if( json.fullDisplayName && typeof json.fullDisplayName === 'string' )
		name = json.fullDisplayName
	
	if( json.result && typeof json.result === 'string' )
		status = json.result.toLowerCase()
	else if( json.building && json.building === true ) {
		status = "building"
		if( msg === '' ) msg = "Building ..."
	}
	
	if( json.timestamp && typeof json.timestamp === 'string' )
		timestamp = json.timestamp
	
	callback( {
		name: name,
		msg: msg,
		status: status,
		timestamp: timestamp
	} )
}
