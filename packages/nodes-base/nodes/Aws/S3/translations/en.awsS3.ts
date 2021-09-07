module.exports = {'en':{'awsS3':{'displayName':'AWS S3','description':'Sends data to AWS S3','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'The operation to perform.','options':{'bucket':{'displayName':'Bucket'},'file':{'displayName':'File'},'folder':{'displayName':'Folder'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'copy':{'displayName':'Copy','description':'Copy a file'},'delete':{'displayName':'Delete','description':'Delete a file'},'download':{'displayName':'Download','description':'Download a file'},'getAll':{'displayName':'Get All','description':'Get all files'},'upload':{'displayName':'Upload','description':'Upload a file'}}},'name':{'name':'name','displayName':'Name','description':'A succinct description of the nature, symptoms, cause, or effect of the bucket.','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'acl':{'displayName':'ACL','description':'The canned ACL to apply to the object.'},'grantFullControl':{'displayName':'Grant Full Control','description':'Gives the grantee READ, READ_ACP, and WRITE_ACP permissions on the object.'},'grantRead':{'displayName':'Grant Read','description':'Allows grantee to read the object data and its metadata.'},'grantReadAcp':{'displayName':'Grant Read ACP','description':'Allows grantee to read the object ACL.'},'grantWriteAcp':{'displayName':'Grant Write ACP','description':'Allows grantee to write the ACL for the applicable object.'},'lockLegalHold':{'displayName':'Lock Legal Hold','description':'Specifies whether a legal hold will be applied to this object'},'lockMode':{'displayName':'Lock Mode','description':'The Object Lock mode that you want to apply to this object.'},'lockRetainUntilDate':{'displayName':'Lock Retain Until Date','description':'The date and time when you want this object\'s Object Lock to expire.'},'parentFolderKey':{'displayName':'Parent Folder Key','description':'Parent file you want to create the file in'},'requesterPays':{'displayName':'Requester Pays','description':'Weather the requester will pay for requests and data transfer. While Requester Pays is enabled, anonymous access to this bucket is disabled.'},'serverSideEncryption':{'displayName':'Server Side Encryption','description':'The server-side encryption algorithm used when storing this object in Amazon S3'},'serverSideEncryptionContext':{'displayName':'Server Side Encryption Context','description':'Specifies the AWS KMS Encryption Context to use for object encryption'},'encryptionAwsKmsKeyId':{'displayName':'Server Side Encryption AWS KMS Key ID','description':'If x-amz-server-side-encryption is present and has the value of aws:kms'},'serversideEncryptionCustomerAlgorithm':{'displayName':'Server Side Encryption Customer Algorithm','description':'Specifies the algorithm to use to when encrypting the object (for example, AES256).'},'serversideEncryptionCustomerKey':{'displayName':'Server Side Encryption Customer Key','description':'Specifies the customer-provided encryption key for Amazon S3 to use in encrypting data'},'serversideEncryptionCustomerKeyMD5':{'displayName':'Server Side Encryption Customer Key MD5','description':'Specifies the 128-bit MD5 digest of the encryption key according to RFC 1321.'},'storageClass':{'displayName':'Storage Class','description':'Amazon S3 storage classes.'}}},'returnAll':{'name':'returnAll','displayName':'Return All','description':'If all results should be returned or only up to a given limit.','options':{}},'limit':{'name':'limit','displayName':'Limit','description':'How many results to return.','options':{}},'bucketName':{'name':'bucketName','displayName':'Bucket Name','options':{}},'folderName':{'name':'folderName','displayName':'Folder Name','options':{}},'folderKey':{'name':'folderKey','displayName':'Folder Key','options':{}},'options':{'name':'options','displayName':'Options','placeholder':'Add Field','options':{'fetchOwner':{'displayName':'Fetch Owner','description':'The owner field is not present in listV2 by default, if you want to return owner field with each key in the result then set the fetch owner field to true.'},'folderKey':{'displayName':'Folder Key'}}},'sourcePath':{'name':'sourcePath','displayName':'Source Path','description':'The name of the source bucket and key name of the source object, separated by a slash (/)','placeholder':'/bucket/my-image.jpg','options':{}},'destinationPath':{'name':'destinationPath','displayName':'Destination Path','description':'The name of the destination bucket and key name of the destination object, separated by a slash (/)','placeholder':'/bucket/my-second-image.jpg','options':{}},'fileName':{'name':'fileName','displayName':'File Name','description':'If not set the binary data filename will be used.','options':{}},'binaryData':{'name':'binaryData','displayName':'Binary Data','description':'If the data to upload should be taken from binary field.','options':{}},'fileContent':{'name':'fileContent','displayName':'File Content','description':'The text content of the file to upload.','options':{}},'binaryPropertyName':{'name':'binaryPropertyName','displayName':'Binary Property','description':'Name of the binary property to which to<br />write the data of the read file.','options':{}},'tagsUi':{'name':'tagsUi','displayName':'Tags','description':'Optional extra headers to add to the message (most headers are allowed).','placeholder':'Add Tag','options':{'tagsValues':{'displayName':'Tag'}}},'fileKey':{'name':'fileKey','displayName':'File Key','options':{}}},'credentials':{'aws':{'region':{'displayName':'Region'},'accessKeyId':{'displayName':'Access Key Id'},'secretAccessKey':{'displayName':'Secret Access Key'},'customEndpoints':{'displayName':'Custom Endpoints'},'rekognitionEndpoint':{'displayName':'Rekognition Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and Rekognition using a VPC endpoint. Leave blank to use the default endpoint.'},'lambdaEndpoint':{'displayName':'Lambda Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and Lambda using a VPC endpoint. Leave blank to use the default endpoint.'},'snsEndpoint':{'displayName':'SNS Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and SNS using a VPC endpoint. Leave blank to use the default endpoint.'},'sesEndpoint':{'displayName':'SES Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and SES using a VPC endpoint. Leave blank to use the default endpoint.'},'sqsEndpoint':{'displayName':'SQS Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and SQS using a VPC endpoint. Leave blank to use the default endpoint.'},'s3Endpoint':{'displayName':'S3 Endpoint','description':'If you use Amazon VPC to host n8n, you can establish a connection between your VPC and S3 using a VPC endpoint. Leave blank to use the default endpoint.'}}}}}};