module.exports = {'en':{'mocean':{'displayName':'Mocean','description':'Send SMS & voice messages via Mocean (https://moceanapi.com)','parameters':{'resource':{'name':'resource','displayName':'Resource','options':{'sms':{'displayName':'SMS'},'voice':{'displayName':'Voice'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'send':{'displayName':'Send','description':'Send SMS/Voice message'}}},'from':{'name':'from','displayName':'From','description':'The number to which to send the message','placeholder':'Sender Number','options':{}},'to':{'name':'to','displayName':'To','description':'The number from which to send the message','placeholder':'Receipient number','options':{}},'language':{'name':'language','displayName':'Language','options':{'cmn-CN':{'displayName':'Chinese Mandarin (China)'},'en-GB':{'displayName':'English (United Kingdom)'},'en-US':{'displayName':'English (United States)'},'ja-JP':{'displayName':'Japanese (Japan)'},'ko-KR':{'displayName':'Korean (Korea)'}}},'message':{'name':'message','displayName':'Message','description':'The message to send','options':{}}},'credentials':{'moceanApi':{'mocean-api-key':{'displayName':'API Key'},'mocean-api-secret':{'displayName':'API Secret'}}}}}};