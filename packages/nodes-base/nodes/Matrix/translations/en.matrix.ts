module.exports = {'en':{'matrix':{'displayName':'Matrix','description':'Consume Matrix API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'The resource to operate on.','options':{'account':{'displayName':'Account'},'event':{'displayName':'Event'},'media':{'displayName':'Media'},'message':{'displayName':'Message'},'room':{'displayName':'Room'},'roomMember':{'displayName':'Room Member'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'getAll':{'displayName':'Get All','description':'Get all members'}}},'roomId':{'name':'roomId','displayName':'Room ID','description':'Room ID','options':{}},'eventId':{'name':'eventId','displayName':'Event ID','description':'The room related to the event','placeholder':'$1234abcd:matrix.org','options':{}},'binaryPropertyName':{'name':'binaryPropertyName','displayName':'Binary Property','options':{}},'mediaType':{'name':'mediaType','displayName':'Media type','description':'Name of the uploaded file','placeholder':'mxc://matrix.org/uploaded-media-uri','options':{'file':{'displayName':'File','description':'General file'},'image':{'displayName':'Image','description':'Image media type'}}},'text':{'name':'text','displayName':'Text','description':'The text to send.','placeholder':'Hello from n8n!','options':{}},'messageType':{'name':'messageType','displayName':'Message Type','description':'The type of message to send.','options':{'m.emote':{'displayName':'Emote','description':'Perform an action (similar to /me in IRC).'},'m.notice':{'displayName':'Notice','description':'Send a notice.'},'m.text':{'displayName':'Text','description':'Send a text message.'}}},'messageFormat':{'name':'messageFormat','displayName':'Message Format','description':'The format of the message\'s body.','options':{'plain':{'displayName':'Plain Text','description':'Text only'},'org.matrix.custom.html':{'displayName':'HTML','description':'HTML-formatted text'}}},'fallbackText':{'name':'fallbackText','displayName':'Fallback Text','description':'A plain text message to display in case the HTML cannot be rendered by the Matrix client.','options':{}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}},'otherOptions':{'name':'otherOptions','displayName':'Other Options','description':'Other options','placeholder':'Add options','options':{'filter':{'displayName':'Filter','description':'A JSON RoomEventFilter to filter returned events with. More information can be found on this <a href="https://matrix.org/docs/spec/client_server/r0.6.0" target="_blank">page</a>.'}}},'roomName':{'name':'roomName','displayName':'Room Name','description':'The operation to perform.','placeholder':'My new room','options':{}},'preset':{'name':'preset','displayName':'Preset','description':'The operation to perform.','placeholder':'My new room','options':{'private_chat':{'displayName':'Private Chat','description':'Private chat'},'public_chat':{'displayName':'Public Chat','description':'Open and public chat'}}},'roomAlias':{'name':'roomAlias','displayName':'Room Alias','description':'The operation to perform.','placeholder':'coolest-room-around','options':{}},'roomIdOrAlias':{'name':'roomIdOrAlias','displayName':'Room ID or Alias','description':'Room ID or alias','options':{}},'userId':{'name':'userId','displayName':'User ID','description':'The fully qualified user ID.','placeholder':'@cheeky_monkey:matrix.org','options':{}},'reason':{'name':'reason','displayName':'Reason','description':'Reason for kick','placeholder':'Telling unfunny jokes','options':{}},'filters':{'name':'filters','displayName':'Filters','description':'Filtering options','placeholder':'Add filter','options':{'notMembership':{'displayName':'Exclude membership','description':'Excludes members whose membership is other than selected (uses OR filter with membership)'},'membership':{'displayName':'Membership','description':'Only fetch users with selected membership status (uses OR filter with exclude membership)'}}}},'credentials':{'matrixApi':{'accessToken':{'displayName':'Access Token'},'homeserverUrl':{'displayName':'Homeserver URL'}}}}}};