module.exports = {'en':{'mqttTrigger':{'displayName':'MQTT Trigger','description':'Listens to MQTT events','parameters':{'topics':{'name':'topics','displayName':'Topics','description':'Topics to subscribe to, multiple can be defined with comma.<br/>\n\t\t\t\twildcard characters are supported (+ - for single level and # - for multi level)<br>\n\t\t\t\tBy default all subscription used QoS=0. To set a different QoS, write the QoS desired<br>\n\t\t\t\tafter the topic preceded by a colom. For Example: topicA:1,topicB:2','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Option','options':{'jsonParseBody':{'displayName':'JSON Parse Body','description':'Try to parse the message to an object.'},'onlyMessage':{'displayName':'Only Message','description':'Returns only the message property.'}}}},'credentials':{'mqtt':{'protocol':{'displayName':'Protocol'},'host':{'displayName':'Host'},'port':{'displayName':'Port'},'username':{'displayName':'Username'},'password':{'displayName':'Password'},'clean':{'displayName':'Clean Session','description':'Set to false to receive QoS 1 and 2 messages while offline.'},'clientId':{'displayName':'Client ID','description':'Client ID. If left empty, one is autogenrated for you'}}}}}};