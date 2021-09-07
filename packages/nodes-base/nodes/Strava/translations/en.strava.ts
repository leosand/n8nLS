module.exports = {'en':{'strava':{'displayName':'Strava','description':'Consume Strava API.','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'The resource to operate on.','options':{'activity':{'displayName':'Activity'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'create':{'displayName':'Create','description':'Create a new activity'},'get':{'displayName':'Get','description':'Get an activity'},'getAll':{'displayName':'Get All','description':'Get all activities'},'getComments':{'displayName':'Get Comments','description':'Get all activity comments'},'getKudos':{'displayName':'Get Kudos','description':'Get all activity kudos'},'getLaps':{'displayName':'Get Laps','description':'Get all activity laps'},'getZones':{'displayName':'Get Zones','description':'Get all activity zones'},'update':{'displayName':'Update','description':'Update an activity'}}},'name':{'name':'name','displayName':'Name','description':'The name of the activity','options':{}},'type':{'name':'type','displayName':'Type','description':'Type of activity. For example - Run, Ride etc.','options':{}},'startDate':{'name':'startDate','displayName':'Start Date','description':'ISO 8601 formatted date time.','options':{}},'elapsedTime':{'name':'elapsedTime','displayName':'Elapsed Time (Seconds)','description':'In seconds.','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'commute':{'displayName':'Commute','description':'Set to true to mark as commute.'},'description':{'displayName':'Description','description':'Description of the activity.'},'distance':{'displayName':'Distance','description':'In meters.'},'trainer':{'displayName':'Trainer','description':'Set to true to mark as a trainer activity.'}}},'activityId':{'name':'activityId','displayName':'Activity ID','description':'ID or email of activity','options':{}},'updateFields':{'name':'updateFields','displayName':'Update Fields','placeholder':'Add Field','options':{'commute':{'displayName':'Commute','description':'Set to true to mark as commute.'},'description':{'displayName':'Description','description':'Description of the activity.'},'gear_id':{'displayName':'Gear ID','description':'Identifier for the gear associated with the activity. ‘none’ clears gear from activity'},'name':{'displayName':'Name','description':'The name of the activity'},'type':{'displayName':'Type','description':'Type of activity. For example - Run, Ride etc.'},'trainer':{'displayName':'Trainer','description':'Set to true to mark as a trainer activity.'}}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}}},'credentials':{'stravaOAuth2Api':{'authUrl':{'displayName':'Authorization URL'},'accessTokenUrl':{'displayName':'Access Token URL'},'scope':{'displayName':'Scope'},'authQueryParameters':{'displayName':'Auth URI Query Parameters'},'authentication':{'displayName':'Authentication'}}}}}};