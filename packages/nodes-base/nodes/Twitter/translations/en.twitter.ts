module.exports = {'en':{'twitter':{'displayName':'Twitter ','description':'Consume Twitter API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'The resource to operate on.','options':{'directMessage':{'displayName':'Direct Message'},'tweet':{'displayName':'Tweet'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'create':{'displayName':'Create','description':'Create or reply a tweet'},'delete':{'displayName':'Delete','description':'Delete a tweet'},'search':{'displayName':'Search','description':'Search tweets'},'like':{'displayName':'Like','description':'Like a tweet'},'retweet':{'displayName':'Retweet','description':'Retweet a tweet'}}},'userId':{'name':'userId','displayName':'User ID','description':'The ID of the user who should receive the direct message.','options':{}},'text':{'name':'text','displayName':'Text','description':'The text of the status update. URL encode as necessary. t.co link wrapping will affect character counts.\t','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'trimUser':{'displayName':'Trim User','description':'When set to either true, each tweet returned in a timeline will include a user object including only the status authors numerical ID.'}}},'tweetId':{'name':'tweetId','displayName':'Tweet ID','description':'The ID of the tweet','options':{}},'searchText':{'name':'searchText','displayName':'Search Text','description':'A UTF-8, URL-encoded search query of 500 characters maximum,</br>\n\t\tincluding operators. Queries may additionally be limited by complexity.</br>\n\t\tCheck the searching examples <a href="https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators">here</a>.','options':{}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}}},'credentials':{'twitterOAuth1Api':{'requestTokenUrl':{'displayName':'Request Token URL'},'authUrl':{'displayName':'Authorization URL'},'accessTokenUrl':{'displayName':'Access Token URL'},'signatureMethod':{'displayName':'Signature Method'}}}}}};