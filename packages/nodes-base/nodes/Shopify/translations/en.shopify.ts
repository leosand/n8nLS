module.exports = {'en':{'shopify':{'displayName':'Shopify','description':'Consume Shopify API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'Resource to consume.','options':{'order':{'displayName':'Order'},'product':{'displayName':'Product'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'create':{'displayName':'Create','description':'Create a product'},'delete':{'displayName':'Delete','description':'Delete a product'},'get':{'displayName':'Get','description':'Get a product'},'getAll':{'displayName':'Get All','description':'Get all products'},'update':{'displayName':'Update','description':'Update a product'}}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'collection_id':{'displayName':'Collection ID','description':'Filter results by product collection ID.'},'created_at_max':{'displayName':'Created At Max','description':'Show products created before date.'},'created_at_min':{'displayName':'Created At Min','description':'Show products created after date'},'fields':{'displayName':'Fields','description':'Show only certain fields, specified by a comma-separated list of field names.'},'handle':{'displayName':'Handle','description':'Filter results by product handle.'},'ids':{'displayName':'IDs','description':'Return only products specified by a comma-separated list of product IDs.'},'presentment_currencies':{'displayName':'Presentment Currencies','description':'Return presentment prices in only certain currencies, specified by a comma-separated list of ISO 4217 currency codes.'},'product_type':{'displayName':'Product Type','description':'Filter results by product type.'},'published_at_max':{'displayName':'Published At Max','description':'Show products published before date.'},'published_at_min':{'displayName':'Published At Min','description':'Show products published after date.'},'published_status':{'displayName':'Published Status','description':'Return products by their published status.'},'title':{'displayName':'Title','description':'Filter results by product title.'},'updated_at_max':{'displayName':'Updated At Max','description':'Show products last updated before date.'},'updated_at_min':{'displayName':'Updated At Min','description':'Show products last updated after date.'},'vendor':{'displayName':'Vendor','description':'Filter results by product vendor.'}}},'limeItemsUi':{'name':'limeItemsUi','displayName':'Line Items','placeholder':'Add Line Item','options':{'lineItemValues':{'displayName':'Line Item'}}},'orderId':{'name':'orderId','displayName':'Order ID','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Field','options':{'attributionAppId':{'displayName':'Attribution App ID','description':'Show orders attributed to a certain app, specified by the app ID. Set as current to show orders for the app currently consuming the API.'},'createdAtMin':{'displayName':'Created At Min','description':'Show orders created at or after date '},'createdAtMax':{'displayName':'Created At Max','description':'Show orders created at or before date'},'financialStatus':{'displayName':'Financial Status','description':'Filter orders by their financial status.'},'fulfillmentStatus':{'displayName':'Fulfillment Status','description':'Filter orders by their fulfillment status.'},'fields':{'displayName':'Fields','description':'Fields the orders will return, formatted as a string of comma-separated values. By default all the fields are returned'},'ids':{'displayName':'IDs','description':'Retrieve only orders specified by a comma-separated list of order IDs.'},'processedAtMax':{'displayName':'Processed At Max','description':'Show orders imported at or before date'},'processedAtMin':{'displayName':'Processed At Min','description':'Show orders imported at or after date'},'status':{'displayName':'Status','description':'Filter orders by their status.'},'sinceId':{'displayName':'Since ID','description':'Show orders after the specified ID.'},'updatedAtMax':{'displayName':'Updated At Max','description':'Show orders last updated at or after date'},'updatedAtMin':{'displayName':'Updated At Min','description':'Show orders last updated at or before date'}}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}},'updateFields':{'name':'updateFields','displayName':'Update Fields','placeholder':'Add Field','options':{'body_html':{'displayName':'Body HTML','description':'A description of the product. Supports HTML formatting.'},'handle':{'displayName':'Handle','description':'A unique human-friendly string for the product.<br>\n\t\t\t\tAutomatically generated from the product\'s title.<br>\n\t\t\t\tUsed by the Liquid templating language to refer to objects.'},'images':{'name':'images','displayName':'Images','description':'A list of product image objects, each one representing an image associated with the product.','placeholder':'Add Image Field','options':{'created_at':{'displayName':'Created At','description':'The date and time when the product image was created.'},'id':{'displayName':'ID','description':'A unique numeric identifier for the product image.'},'position':{'displayName':'Position','description':'The order of the product image in the list.<br>\n\t\t\t\t\t\tThe first product image is at position 1 and is the "main" image for the product.'},'product_id':{'displayName':'Product ID','description':'The id of the product associated with the image.'},'variant_ids':{'displayName':'Variant IDs','description':'An array of variant ids associated with the image.'},'src':{'displayName':'Source','description':'Specifies the location of the product image.<br>\n\t\t\t\t\t\tThis parameter supports URL filters that you can use to retrieve modified copies of the image.<br>\n\t\t\t\t\t\tFor example, add _small, to the filename to retrieve a scaled copy of the image at 100 x 100 px (for example, ipod-nano_small.png),<br>\n\t\t\t\t\t\tor add _2048x2048 to retrieve a copy of the image constrained at 2048 x 2048 px resolution (for example, ipod-nano_2048x2048.png).'},'width':{'displayName':'Width','description':'Width dimension of the image which is determined on upload.'},'height':{'displayName':'Height','description':'Height dimension of the image which is determined on upload.'},'updated_at':{'displayName':'Updated At','description':'The date and time when the product image was last modified.'}}},'productOptions':{'name':'productOptions','displayName':'Options','description':'The custom product property names like Size, Color, and Material.</br>\n\t\t\t\tYou can add up to 3 options of up to 255 characters each.','placeholder':'Add Option','options':{'option':{'displayName':'Option'}}},'product_type':{'displayName':'Product Type','description':'A categorization for the product used for filtering and searching products.'},'published_at':{'displayName':'Published At','description':'The date and time (ISO 8601 format) when the product was published. Can be set to null to unpublish the product from the Online Store channel.'},'published_scope':{'displayName':'Published Scope'},'tags':{'displayName':'Tags','description':'A string of comma-separated tags that are used for filtering and search. A product can have up to 250 tags. Each tag can have up to 255 characters.'},'template_suffix':{'displayName':'Template Suffix','description':'The suffix of the Liquid template used for the product page. If this property is specified, then the product page uses a template called "product.suffix.liquid", where "suffix" is the value of this property. If this property is "" or null, then the product page uses the default template "product.liquid". (default: null)'},'title':{'displayName':'Title','description':'The name of the product.'},'vendor':{'displayName':'Vendor','description':'The name of the product\'s vendor.'}}},'title':{'name':'title','displayName':'Title','description':'The name of the product.','options':{}},'productId':{'name':'productId','displayName':'Product ID','options':{}}},'credentials':{'shopifyApi':{'apiKey':{'displayName':'API Key'},'password':{'displayName':'Password'},'shopSubdomain':{'displayName':'Shop Subdomain','description':'Only the subdomain without .myshopify.com'},'sharedSecret':{'displayName':'Shared Secret'}}}}}};