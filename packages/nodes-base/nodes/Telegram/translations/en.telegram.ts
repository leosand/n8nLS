module.exports = {'en':{'telegram':{'displayName':'Telegram','description':'Sends data to Telegram.','parameters':{'resource':{'name':'resource','displayName':'Resource','description':'The resource to operate on.','options':{'chat':{'displayName':'Chat'},'callback':{'displayName':'Callback'},'file':{'displayName':'File'},'message':{'displayName':'Message'}}},'operation':{'name':'operation','displayName':'Operation','description':'The operation to perform.','options':{'editMessageText':{'displayName':'Edit Message Text','description':'Edit a text message'},'pinChatMessage':{'displayName':'Pin Chat Message','description':'Pin a chat message'},'unpinChatMessage':{'displayName':'Unpin Chat Message','description':'Unpin a chat message'},'sendAnimation':{'displayName':'Send Animation','description':'Send an animated file'},'sendAudio':{'displayName':'Send Audio','description':'Send a audio file'},'sendChatAction':{'displayName':'Send Chat Action','description':'Send a chat action'},'sendDocument':{'displayName':'Send Document','description':'Send a document'},'sendLocation':{'displayName':'Send Location','description':'Send a location'},'sendMessage':{'displayName':'Send Message','description':'Send a text message'},'sendMediaGroup':{'displayName':'Send Media Group','description':'Send group of photos or videos to album'},'sendPhoto':{'displayName':'Send Photo','description':'Send a photo'},'sendSticker':{'displayName':'Send Sticker','description':'Send a sticker'},'sendVideo':{'displayName':'Send Video','description':'Send a video'}}},'chatId':{'name':'chatId','displayName':'Chat ID','description':'Unique identifier for the target chat or username of the target<br />channel (in the format @channelusername). To find your chat id ask @get_id_bot.','options':{}},'messageId':{'name':'messageId','displayName':'Message ID','description':'Unique identifier of the message to edit.','options':{}},'additionalFields':{'name':'additionalFields','displayName':'Additional Fields','placeholder':'Add Field','options':{'caption':{'displayName':'Caption','description':'Caption text to set, 0-1024 characters.'},'disable_notification':{'displayName':'Disable Notification','description':'Sends the message silently. Users will receive a notification with no sound.'},'disable_web_page_preview':{'displayName':'Disable WebPage Preview','description':'Disables link previews for links in this message.'},'duration':{'displayName':'Duration','description':'Duration of clip in seconds.'},'height':{'displayName':'Height','description':'Height of the video.'},'parse_mode':{'displayName':'Parse Mode','description':'How to parse the text.'},'performer':{'displayName':'Performer','description':'Name of the performer.'},'reply_to_message_id':{'displayName':'Reply To Message ID','description':'If the message is a reply, ID of the original message.'},'title':{'displayName':'Title','description':'Title of the track.'},'thumb':{'displayName':'Thumbnail','description':'Thumbnail of the file sent; can be ignored if thumbnail generation<br />for the file is supported server-side. The thumbnail should be in<br />JPEG format and less than 200 kB in size. A thumbnail‘s<br />width and height should not exceed 320.'},'width':{'displayName':'Width','description':'Width of the video.'}}},'userId':{'name':'userId','displayName':'User ID','description':'Unique identifier of the target user.','options':{}},'description':{'name':'description','displayName':'Description','description':'New chat description, 0-255 characters.','options':{}},'title':{'name':'title','displayName':'Title','description':'New chat title, 1-255 characters.','options':{}},'queryId':{'name':'queryId','displayName':'Query ID','description':'Unique identifier for the answered query.','options':{}},'results':{'name':'results','displayName':'Results','description':'A JSON-serialized array of results for the inline query.','options':{}},'fileId':{'name':'fileId','displayName':'File ID','description':'The ID of the file.','options':{}},'download':{'name':'download','displayName':'Download','description':'Download the file.','options':{}},'messageType':{'name':'messageType','displayName':'Message Type','description':'The type of the message to edit.','options':{'inlineMessage':{'displayName':'Inline Message'},'message':{'displayName':'Message'}}},'inlineMessageId':{'name':'inlineMessageId','displayName':'Inline Message ID','description':'Unique identifier of the inline message to edit.','options':{}},'replyMarkup':{'name':'replyMarkup','displayName':'Reply Markup','description':'Additional interface options.','options':{'none':{'displayName':'None'},'forceReply':{'displayName':'Force Reply'},'inlineKeyboard':{'displayName':'Inline Keyboard'},'replyKeyboard':{'displayName':'Reply Keyboard'},'replyKeyboardRemove':{'displayName':'Reply Keyboard Remove'}}},'file':{'name':'file','displayName':'Video','description':'Video file to send. Pass a file_id to send a file that exists on the Telegram servers (recommended)<br />or pass an HTTP URL for Telegram to get a file from the Internet.','options':{}},'action':{'name':'action','displayName':'Action','description':'Type of action to broadcast. Choose one, depending on what the user is about to receive.<br />The status is set for 5 seconds or less (when a message arrives from your bot).','options':{'find_location':{'displayName':'Find Location'},'record_audio':{'displayName':'Record Audio'},'record_video':{'displayName':'Record Video'},'record_video_note':{'displayName':'Record Video Note'},'typing':{'displayName':'Typing'},'upload_audio':{'displayName':'Upload Audio'},'upload_document':{'displayName':'Upload Document'},'upload_photo':{'displayName':'Upload Photo'},'upload_video':{'displayName':'Upload Video'},'upload_video_note':{'displayName':'Upload Video Note'}}},'latitude':{'name':'latitude','displayName':'Latitude','description':'Location latitude','options':{}},'longitude':{'name':'longitude','displayName':'Longitude','description':'Location longitude','options':{}},'media':{'name':'media','displayName':'Media','description':'The media to add.','placeholder':'Add Media','options':{'media':{'displayName':'Media'}}},'text':{'name':'text','displayName':'Text','description':'Text of the message to be sent.','options':{}},'forceReply':{'name':'forceReply','displayName':'Force Reply','placeholder':'Add Field','options':{'force_reply':{'displayName':'Force Reply','description':'Shows reply interface to the user, as if they manually selected the bot‘s message and tapped ’Reply.'},'selective':{'displayName':'Selective','description':' Use this parameter if you want to force reply from specific users only.'}}},'inlineKeyboard':{'name':'inlineKeyboard','displayName':'Inline Keyboard','description':'Adds an inline keyboard that appears right next to the message it belongs to.','placeholder':'Add Keyboard Row','options':{'rows':{'displayName':'Rows'}}},'replyKeyboard':{'name':'replyKeyboard','displayName':'Reply Keyboard','description':'Adds a custom keyboard with reply options.','placeholder':'Add Reply Keyboard Row','options':{'rows':{'displayName':'Rows'}}},'replyKeyboardOptions':{'name':'replyKeyboardOptions','displayName':'Reply Keyboard Options','placeholder':'Add Option','options':{'resize_keyboard':{'displayName':'Resize Keyboard','description':'Requests clients to resize the keyboard vertically for optimal fit.'},'one_time_keyboard':{'displayName':'One Time Keyboard','description':'Requests clients to hide the keyboard as soon as it\'s been used.'},'selective':{'displayName':'Selective','description':'Use this parameter if you want to show the keyboard to specific users only.'}}},'replyKeyboardRemove':{'name':'replyKeyboardRemove','displayName':'Reply Keyboard Remove','placeholder':'Add Field','options':{'remove_keyboard':{'displayName':'Remove Keyboard','description':'Requests clients to remove the custom keyboard.'},'selective':{'displayName':'Selective','description':' Use this parameter if you want to force reply from specific users only.'}}}},'credentials':{'telegramApi':{'accessToken':{'displayName':'Access Token','description':'Chat with the <a href="https://telegram.me/botfather">bot father</a> to obtain the access token.'}}}}}};