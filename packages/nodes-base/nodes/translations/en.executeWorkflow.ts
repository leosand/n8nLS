module.exports = {'en':{'executeWorkflow':{'displayName':'Execute Workflow','description':'Execute another workflow','parameters':{'source':{'name':'source','displayName':'Source','description':'Where to get the workflow to execute from.','options':{'database':{'displayName':'Database','description':'Load the workflow from the database by ID.'},'localFile':{'displayName':'Local File','description':'Load the workflow from a locally saved file.'},'parameter':{'displayName':'Parameter','description':'Load the workflow from a parameter.'},'url':{'displayName':'URL','description':'Load the workflow from an URL.'}}},'workflowId':{'name':'workflowId','displayName':'Workflow ID','description':'The workflow to execute.','options':{}},'workflowPath':{'name':'workflowPath','displayName':'Workflow Path','description':'The path to local JSON workflow file to execute.','placeholder':'/data/workflow.json','options':{}},'workflowJson':{'name':'workflowJson','displayName':'Workflow JSON','description':'The workflow JSON code to execute.','options':{}},'workflowUrl':{'name':'workflowUrl','displayName':'Workflow URL','description':'The URL from which to load the workflow from.','placeholder':'https://example.com/workflow.json','options':{}}},'credentials':{}}}};