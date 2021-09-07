module.exports = {'en':{'lemlist':{'displayName':'Lemlist','description':'Consume the Lemlist API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'Resource to consume','options':{'activity':{'displayName':'Activity'},'campaign':{'displayName':'Campaign'},'lead':{'displayName':'Lead'},'team':{'displayName':'Team'},'unsubscribe':{'displayName':'Unsubscribes'}}},'operation':{'name':'operation','displayName':'Operation','description':'Operation to perform','options':{'add':{'displayName':'Add'},'delete':{'displayName':'Delete'},'getAll':{'displayName':'Get All'}}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'Return all results.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'The number of results to return.','options':{}},'filters':{'name':'filters','displayName':'Filters','placeholder':'Add Filter','options':{'campaignId':{'displayName':'Campaign ID','description':'ID of the campaign to retrieve activity for.'},'type':{'displayName':'Type','description':'Type of activity to retrieve.'}}},'campaignId':{'name':'campaignId','displayName':'Campaign ID','description':'ID of the campaign to unsubscribe the lead from.','options':{}},'email':{'name':'email','displayName':'Email','description':'Email to delete from the unsubscribes.','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'companyName':{'displayName':'Company Name','description':'Company name of the lead to create.'},'deduplicate':{'displayName':'Deduplicate','description':'Do not insert if this email is already present in another campaign.'},'firstName':{'displayName':'First Name','description':'First name of the lead to create.'},'lastName':{'displayName':'Last Name','description':'Last name of the lead to create.'}}}},'credentials':{'lemlistApi':{'apiKey':{'displayName':'API Key'}}}}}};