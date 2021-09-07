module.exports = {'en':{'vero':{'displayName':'Vero','description':'Consume Vero API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'Resource to consume.','options':{'user':{'displayName':'User','description':'Create, update and manage the subscription status of your users.'},'event':{'displayName':'Event','description':'Track events based on actions your customers take in real time.'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'track':{'displayName':'Track','description':'Track an event for a specific customer'}}},'id':{'name':'id','displayName':'ID','description':'The unique identifier of the customer','options':{}},'jsonParameters':{'name':'jsonParameters','displayName':'JSON Parameters','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'email':{'displayName':'Email','description':'The table to create the row in.'}}},'dataAttributesUi':{'name':'dataAttributesUi','displayName':'Data','description':'key value pairs that represent any properties you want to track with this event','placeholder':'Add Data','options':{'dataAttributesValues':{'displayName':'Data'}}},'dataAttributesJson':{'name':'dataAttributesJson','displayName':'Data','description':'key value pairs that represent the custom user properties you want to update','options':{}},'newId':{'name':'newId','displayName':'New ID','description':'The new unique identifier of the user','options':{}},'tags':{'name':'tags','displayName':'Tags','description':'Tags to remove separated by ","','options':{}},'email':{'name':'email','displayName':'Email','description':'Email','options':{}},'eventName':{'name':'eventName','displayName':'Event Name','description':'The name of the event tracked.','options':{}},'extraAttributesUi':{'name':'extraAttributesUi','displayName':'Extra','description':'Key value pairs that represent reserved, Vero-specific operators. Refer to the note on “deduplication” below.','placeholder':'Add Extra','options':{'extraAttributesValues':{'displayName':'Extra'}}},'extraAttributesJson':{'name':'extraAttributesJson','displayName':'Extra','description':'Key value pairs that represent reserved, Vero-specific operators. Refer to the note on “deduplication” below.','options':{}}},'credentials':{'veroApi':{'authToken':{'displayName':'Auth Token'}}}}}};