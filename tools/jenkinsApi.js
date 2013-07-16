var API = {};
module.exports = API;

API.getMsg = function( json, callback ) {
	var changes = [];
	var user = '';
	var branch = '';
	var node = '';
	var msg = '';
	var msg2 = '';
	var status = '';
	var timestamp = '';
	var name = '';

	// in our setup, the first two of these if's should be mutually exclusive ... I might be wrong, though
	if( 
		json.changeSet &&
		typeof json.changeSet === 'object' &&
		json.changeSet.items &&
		typeof json.changeSet.items === 'object' &&
		Array.isArray( json.changeSet.items )
	) {
		json.changeSet.items.forEach( function( cs ) {
			if( 
				cs.user &&
				typeof cs.user === 'string' 
			) {
				cUser = cs.user;
			} else if ( 
				cs.author &&
				typeof cs.author === 'object' &&
				cs.author.fullName &&
				typeof cs.author.fullName === 'string' 
			) {
				cUser = cs.author.fullName;
			}
			changes.push( cUser + ": " + cs.msg);
		});
	}
	if( 
		json.actions &&
		typeof json.actions === 'object' &&
		Array.isArray( json.actions ) 
	) {
		json.actions.forEach( function( actionArray ) {
			if( actionArray !== null && typeof actionArray === 'object' && ( actionArray.parameters || actionArray.causes )) {
				Object.keys( actionArray ).forEach( function( action ) {
					var actionValue = actionArray[ action ];
					switch( action ) {
					case "parameters":
					if( actionValue && Array.isArray( actionValue ) ) {
					actionValue.forEach( function( actionParam ) {
						if( actionParam &&
							actionParam.name &&
							( actionParam.name == "SVN_BRANCH" || actionParam.name == "BRANCH" ) &&
							actionParam.value &&
							typeof actionParam.value 
						  ) {
						branch = actionParam.value.replace( /(branches\/)|(origin\/)/g, '' );
						}
						});
					}
					break;
					case "causes":
					if( actionValue &&
						Array.isArray( actionValue ) ) {
					actionValue.forEach( function( actionParam ) {
						if( actionParam ) {
						if( actionParam.userName &&
							typeof actionParam.userName === 'string'
						  ) {
						user = actionParam.userName;
						} else if( actionParam.shortDescription &&
							typeof actionParam.shortDescription === 'string' &&
							actionParam.shortDescription == 'Started by timer'
							) {
						user = actionParam.shortDescription;
						}
						}
						});
					}
					break;
					}
				});
			}
		});
	}
	if( json.builtOn &&
		typeof json.builtOn === 'string' &&
		json.builtOn.length > 0
	) {
		node = json.builtOn;
	}

	// Now build a meaningful string
	var linebreak = '<br />';
	
	if( changes.length > 0 && changes.length < 3 ) {
		msg = changes.join( linebreak );
	} else if( changes.length >= 3 ) {
		msg = changes.slice( 0, 3 ).join( linebreak );
		msg2 = changes.slice( 3 ).join( linebreak );
	}
	
	if( json.result && typeof json.result === 'string' )
		status = json.result.toLowerCase();
	else if( json.building && json.building === true ) {
		status = "building";
		if( msg === '' ) msg = "Building ...";
	}
	
	// user overrides changes if a branch was found ...
	if( user.length && branch.length ){
		var verb = " built ";
		if( json.building )
			verb = " is building ";
		msg = user + verb + branch;
		if( node.length > 0 )
			msg += " on " + node;
	}

	if( ! msg.length && user.length ) {
		msg = user;
		if (json.building)
			msg += " [building]";
	}

	if( json.fullDisplayName && typeof json.fullDisplayName === 'string' )
		name = json.fullDisplayName;
	else if( json.name && typeof json.name === 'string' )
		name = json.name;
	
	if( json.timestamp && typeof json.timestamp === 'string' )
		timestamp = json.timestamp;
	
	callback( {
		name: name,
		msg: msg,
		msg2: msg2,
		status: status,
		timestamp: timestamp
	} );
};
