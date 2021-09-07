module.exports = {'en':{'wooCommerce':{'displayName':'WooCommerce','description':'Consume WooCommerce API','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'Resource to consume.','options':{'order':{'displayName':'Order'},'product':{'displayName':'Product'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'create':{'displayName':'Create','description':'Create a order'},'delete':{'displayName':'Delete','description':'Delete a order'},'get':{'displayName':'Get','description':'Get a order'},'getAll':{'displayName':'Get All','description':'Get all orders'},'update':{'displayName':'Update','description':'Update a order'}}},'name':{'name':'name','displayName':'Name','description':'Product name.','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'currency':{'displayName':'Currency','description':'Currency the order was created with'},'customerId':{'displayName':'Customer ID','description':'User ID who owns the order. 0 for guests'},'customerNote':{'displayName':'Customer Note','description':'Note left by customer during checkout.'},'parentId':{'displayName':'Parent ID','description':'Parent order ID.'},'paymentMethodId':{'displayName':'Payment Method ID','description':'Payment method ID.'},'paymentMethodTitle':{'displayName':'Payment Method Title','description':'Payment method title.'},'setPaid':{'displayName':'Set Paid','description':'Define if the order is paid. It will set the status to processing and reduce stock items'},'status':{'displayName':'Status','description':'A named status for the order.'},'transactionID':{'displayName':'Transaction ID','description':'Unique transaction ID'}}},'dimensionsUi':{'name':'dimensionsUi','displayName':'Dimensions','description':'Product dimensions','placeholder':'Add Dimension','options':{'dimensionsValues':{'displayName':'Dimension'}}},'imagesUi':{'name':'imagesUi','displayName':'Images','description':'Product Image','placeholder':'Add Image','options':{'imagesValues':{'displayName':'Image'}}},'metadataUi':{'name':'metadataUi','displayName':'Metadata','description':'Meta data','placeholder':'Add Metadata','options':{'metadataValues':{'displayName':'Metadata'}}},'productId':{'name':'productId','displayName':'Product ID','description':'Product ID.','options':{}},'updateFields':{'name':'updateFields','displayName':'Update Fields','placeholder':'Add Field','options':{'currency':{'displayName':'Currency','description':'Currency the order was created with'},'customerId':{'displayName':'Customer ID','description':'User ID who owns the order. 0 for guests'},'customerNote':{'displayName':'Customer Note','description':'Note left by customer during checkout.'},'parentId':{'displayName':'Parent ID','description':'Parent order ID.'},'paymentMethodId':{'displayName':'Payment Method ID','description':'Payment method ID.'},'paymentMethodTitle':{'displayName':'Payment Method Title','description':'Payment method title.'},'status':{'displayName':'Status','description':'A named status for the order.'},'transactionID':{'displayName':'Transaction ID','description':'Unique transaction ID'}}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Option','options':{'after':{'displayName':'After','description':'Limit response to resources published after a given ISO8601 compliant date.'},'before':{'displayName':'Before','description':'Limit response to resources published before a given ISO8601 compliant date'},'customer':{'displayName':'Customer','description':'Limit result set to orders assigned a specific customer.'},'decimalPoints':{'displayName':'Decimal Points','description':'Number of decimal points to use in each resource.'},'order':{'displayName':'Order','description':'Order sort attribute ascending or descending.'},'product':{'displayName':'Product','description':'Limit result set to orders assigned a specific product.'},'orderBy':{'displayName':'Order By','description':'Sort collection by object attribute.'},'search':{'displayName':'Search','description':'Limit results to those matching a string.'},'status':{'displayName':'Status','description':'Limit result set to orders assigned a specific status.'}}},'billingUi':{'name':'billingUi','displayName':'Billing','description':'Billing address','placeholder':'Add Billing','options':{'billingValues':{'displayName':'Address'}}},'couponLinesUi':{'name':'couponLinesUi','displayName':'Coupon Lines','description':'Coupons line data','placeholder':'Add Coupon Line','options':{'couponLinesValues':{'displayName':'Coupon Line'}}},'feeLinesUi':{'name':'feeLinesUi','displayName':'Fee Lines','description':'Fee line data','placeholder':'Add Fee Line','options':{'feeLinesValues':{'displayName':'Fee Line'}}},'lineItemsUi':{'name':'lineItemsUi','displayName':'Line Items','description':'Line item data','placeholder':'Add Line Item','options':{'lineItemsValues':{'displayName':'Line Item'}}},'shippingUi':{'name':'shippingUi','displayName':'Shipping','description':'Shipping address','placeholder':'Add Shipping','options':{'shippingValues':{'displayName':'Address'}}},'shippingLinesUi':{'name':'shippingLinesUi','displayName':'Shipping Lines','description':'Shipping line data','placeholder':'Add Shipping Line','options':{'shippingLinesValues':{'displayName':'Fee Line'}}},'orderId':{'name':'orderId','displayName':'Order ID','description':'order ID.','options':{}}},'credentials':{'wooCommerceApi':{'consumerKey':{'displayName':'Consumer Key'},'consumerSecret':{'displayName':'Consumer Secret'},'url':{'displayName':'WooCommerce URL'},'includeCredentialsInQuery':{'displayName':'Include Credentials in Query','description':'Occasionally, some servers may not parse the Authorization header correctly</br>\n\t\t\t(if you see a “Consumer key is missing” error when authenticating over SSL, you have a server issue).</br>\n\t\t\tIn this case, you may provide the consumer key/secret as query string parameters instead.'}}}}}};