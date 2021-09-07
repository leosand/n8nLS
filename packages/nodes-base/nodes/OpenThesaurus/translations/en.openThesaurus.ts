module.exports = {'en':{'openThesaurus':{'displayName':'OpenThesaurus','description':'Get synonmns for German words using the OpenThesaurus API','parameters':{'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'getSynonyms':{'displayName':'Get Synonyms','description':'Get synonyms for a German word in German'}}},'text':{'name':'text','displayName':'Text','description':'The word to get synonyms for','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Options','options':{'baseform':{'displayName':'Baseform','description':'Specifies the basic form for the search term if it is not already a basic form.'},'similar':{'displayName':'Similar','description':'This also returns up to five similarly written words for each answer.</br> This is useful to be able to make a suggestion to the user in the event of a possible typing error.'},'startswith':{'displayName':'Starts With','description':'Like substring = true, but only finds words that begin with the specified search term.'},'substring':{'displayName':'Substring','description':'With this, up to ten words are returned for each answer that only contain the search term as a partial word.'},'substringFromResults':{'displayName':'Substring From Results','description':'Specifies from which entry the partial word hits are to be returned.</br> Only works together with substring = true.'},'substringMaxResults':{'displayName':'Substring Max Results','description':'Specifies how many partial word hits should be returned in total.</br> Only works together with substring = true.'},'subsynsets':{'displayName':'Subsynsets','description':'Indicates that each synonym group has its (optional) sub-terms supplied.'},'supersynsets':{'displayName':'Supersynsets','description':'Indicates that each synonym group is supplied with its (optional) generic terms.'}}}},'credentials':{}}}};