from django.shortcuts import render
from django.http import HttpResponseForbidden, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from linebot import (LineBotApi, WebhookHandler)
from linebot.exceptions import (InvalidSignatureError)
from linebot.models import (
    MessageEvent,
    TextMessage,
    TextSendMessage,
)
import os, json

#--------------------------------------------------
CHANNEL_ACCESS_TOKEN = os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET = os.environ["CHANNEL_SECRET"]

line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
handler      = WebhookHandler(CHANNEL_SECRET)

#--------------------------------------------------
import logging
logger = logging.getLogger('bot')

#--------------------------------------------------
@csrf_exempt
def callback(request):
    '''
    Callback 関数
    :param request:
    :return:
    '''

    try:
        # get X-Line-Signature header value
        # signature = request.META['HTTP_X_LINE_SIGNATURE']
        signature = request.headers['X-Line-Signature']

        body = request.body.decode('utf-8')
        logger.debug("Request body: " + body)

        """
        body_json = json.loads(body)
        events = body_json['events']
        for event in events:
            message     = event['message']
            reply_token = event['replyToken']
        """

        handler.handle(body, signature)

    except InvalidSignatureError:
        logger.error("Invalid signature. Please check your channel access token/channel secret.")
        HttpResponseForbidden()

    except Exception as e:
        logger.error("Error: {}".format(e))


    return HttpResponse('OK', status=200)

#--------------------------------------------------
@handler.add(MessageEvent, message=TextMessage)
def handle_text_message(event):
    '''
    テキストメッセージ
    :param event:
    :return:
    '''
    #logger.debug("handle_text_message: " + event.message.text)

    # see also: https://qiita.com/q_masa/items/c9db3e8396fb62cc64ed
    if event.reply_token == "00000000000000000000000000000000":
        return

    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=event.message.text)
    )
