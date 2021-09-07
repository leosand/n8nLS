module.exports = {'en':{'amqp':{'displayName':'AMQP Sender','description':'Sends a raw-message via AMQP 1.0, executed once per item','parameters':{'sink':{'name':'sink','displayName':'Queue / Topic','description':'name of the queue of topic to publish to','placeholder':'topic://sourcename.something','options':{}},'headerParametersJson':{'name':'headerParametersJson','displayName':'Headers','description':'Header parameters as JSON (flat object). Sent as application_properties in amqp-message meta info.','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Option','options':{'containerId':{'displayName':'Container ID','description':'Will be used to pass to the RHEA Backend as container_id'},'dataAsObject':{'displayName':'Data as Object','description':'Send the data as an object.'},'reconnect':{'displayName':'Reconnect','description':'Automatically reconnect if disconnected'},'reconnectLimit':{'displayName':'Reconnect Limit','description':'Maximum number of reconnect attempts'},'sendOnlyProperty':{'displayName':'Send property','description':'The only property to send. If empty the whole item will be sent.'}}}},'credentials':{'amqp':{'hostname':{'displayName':'Hostname'},'port':{'displayName':'Port'},'username':{'displayName':'User'},'password':{'displayName':'Password'},'transportType':{'displayName':'Transport Type','description':'Optional Transport Type to use.'}}}}}};