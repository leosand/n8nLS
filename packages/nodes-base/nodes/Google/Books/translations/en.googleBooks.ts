module.exports = {'en':{'googleBooks':{'displayName':'Google Books','description':'Read data from Google Books','parameters':{'authentication':{'name':'authentication','displayName':'Authentication','options':{'serviceAccount':{'displayName':'Service Account'},'oAuth2':{'displayName':'OAuth2'}}},'resource':{'name':'resource','displayName':'Resource','description':'The resource to operate on.','options':{'bookshelf':{'displayName':'Bookshelf'},'bookshelfVolume':{'displayName':'Bookshelf Volume'},'volume':{'displayName':'Volume'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'get':{'displayName':'Get','description':'Get a volume resource based on ID'},'getAll':{'displayName':'Get All','description':'Get all volumes filtered by query'}}},'myLibrary':{'name':'myLibrary','displayName':'My Library','options':{}},'searchQuery':{'name':'searchQuery','displayName':'Search Query','description':'Full-text search query string.','options':{}},'userId':{'name':'userId','displayName':'User ID','description':'ID of user','options':{}},'shelfId':{'name':'shelfId','displayName':'Bookshelf ID','description':'ID of the bookshelf.','options':{}},'volumeId':{'name':'volumeId','displayName':'Volume ID','description':'ID of the volume.','options':{}},'volumePosition':{'name':'volumePosition','displayName':'Volume Position','description':'Position on shelf to move the item (0 puts the item before the<br />current first item, 1 puts it between the first and the second and so on).','options':{}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}}},'credentials':{'googleApi':{'email':{'displayName':'Service Account Email','description':'The Google Service account similar to user-808@project.iam.gserviceaccount.com.'},'privateKey':{'displayName':'Private Key','description':'Use the multiline editor. Make sure there are exactly 3 lines.<br />-----BEGIN PRIVATE KEY-----<br />KEY IN A SINGLE LINE<br />-----END PRIVATE KEY-----'},'inpersonate':{'displayName':' Impersonate a User'},'delegatedEmail':{'displayName':'Email','description':'The email address of the user for which the application is requesting delegated access.'}},'googleBooksOAuth2Api':{'scope':{'displayName':'Scope'}}}}}};