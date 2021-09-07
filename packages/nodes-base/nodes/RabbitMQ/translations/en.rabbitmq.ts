module.exports = {'en':{'rabbitmq':{'displayName':'RabbitMQ','description':'Sends messages to a RabbitMQ topic','parameters':{'mode':{'name':'mode','displayName':'Mode','description':'To where data should be moved.','options':{'queue':{'displayName':'Queue','description':'Publish data to queue.'},'exchange':{'displayName':'Exchange','description':'Publish data to exchange.'}}},'queue':{'name':'queue','displayName':'Queue / Topic','description':'Name of the queue to publish to.','placeholder':'queue-name','options':{}},'exchange':{'name':'exchange','displayName':'Exchange','description':'Name of the exchange to publish to.','placeholder':'exchange-name','options':{}},'exchangeType':{'name':'exchangeType','displayName':'Type','description':'Type of exchange.','options':{'direct':{'displayName':'Direct','description':'Direct exchange type.'},'topic':{'displayName':'Topic','description':'Topic exchange type.'},'headers':{'displayName':'Headers','description':'Headers exchange type.'},'fanout':{'displayName':'Fanout','description':'Fanout exchange type.'}}},'routingKey':{'name':'routingKey','displayName':'Routing key','description':'The routing key for the message.','placeholder':'routing-key','options':{}},'sendInputData':{'name':'sendInputData','displayName':'Send Input Data','description':'Send the the data the node receives as JSON.','options':{}},'message':{'name':'message','displayName':'Message','description':'The message to be sent.','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Option','options':{'alternateExchange':{'displayName':'Alternate Exchange','description':'An exchange to send messages to if this exchange can’t route them to any queues'},'arguments':{'name':'arguments','displayName':'Arguments','description':'Arguments to add.','placeholder':'Add Argument','options':{'argument':{'displayName':'Argument'}}},'autoDelete':{'displayName':'Auto Delete','description':'The queue will be deleted when the number of consumers drops to zero .'},'durable':{'displayName':'Durable','description':'The queue will survive broker restarts.'},'exclusive':{'displayName':'Exclusive','description':'Scopes the queue to the connection.'},'headers':{'name':'headers','displayName':'Headers','description':'Headers to add.','placeholder':'Add Header','options':{'header':{'displayName':'Header'}}}}}},'credentials':{'rabbitmq':{'hostname':{'displayName':'Hostname'},'port':{'displayName':'Port'},'username':{'displayName':'User'},'password':{'displayName':'Password'},'vhost':{'displayName':'Vhost'},'ssl':{'displayName':'SSL'},'passwordless':{'displayName':'Passwordless','description':'Passwordless connection with certificates (SASL mechanism EXTERNAL)'},'ca':{'displayName':'CA Certificates','description':'SSL CA Certificates to use.'},'cert':{'displayName':'Client Certificate','description':'SSL Client Certificate to use.'},'key':{'displayName':'Client Key','description':'SSL Client Key to use.'},'passphrase':{'displayName':'Passphrase','description':'SSL passphrase to use.'}}}}}};