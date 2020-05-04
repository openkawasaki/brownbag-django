from django.shortcuts import render
from django.http import HttpResponseForbidden, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from linebot import (LineBotApi, WebhookHandler)
from linebot.exceptions import (InvalidSignatureError)

"""
from linebot.models import (
    MessageEvent,
    TextMessage,
    TextSendMessage,
)
"""
import os, json

from .Dialogflow.detect_intent_texts import post_intent_texts
import uuid

#--------------------------------------------------
import logging
logger = logging.getLogger('bot')

#--------------------------------------------------
import requests

REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply'
CHANNEL_ACCESS_TOKEN = os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET = os.environ["CHANNEL_SECRET"]

LINE_APP_URL = os.environ["LINE_APP_URL"]

line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
handler      = WebhookHandler(CHANNEL_SECRET)

HEADER = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
}

#--------------------------------------------------
def reply_text(reply_token, text):

    # see also: https://qiita.com/q_masa/items/c9db3e8396fb62cc64ed
    if reply_token == "00000000000000000000000000000000":
        return

    payload = {
          "replyToken":reply_token,
          "messages":[
                {
                    "type":"text",
                    "text": text
                }
            ]
    }

    requests.post(REPLY_ENDPOINT, headers=HEADER, data=json.dumps(payload)) # LINEにデータを送信

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
        #signature = request.headers['X-Line-Signature']

        body = request.body.decode('utf-8')
        logger.debug("Request body: " + body)

        body_json = json.loads(body)
        events = body_json['events']
        for event in events:
            message = event['message']
            reply_token = event['replyToken']

            if message["type"] == "image":
                id = message["id"]
                text = "画像データ：ID={}".format(id)
                send_text = "現在開発中です。もう少しお待ちください。\n\n開発用ログ：\n" + text

            elif message["type"] == "location":
                id = message["id"]
                #address   = message["address"]
                latitude  = message["latitude"]
                longitude = message["longitude"]
                text = "位置情報データ：ID={}: 緯度={}: 経度={}".format(id, latitude, longitude)
                send_text = "現在開発中です。もう少しお待ちください。\n\n開発用ログ：\n" + text

            elif message["type"] == "text":
                #id = message["id"]
                textdata =  message["text"]
                texts    = [ textdata ]

                project_id    = os.environ.get('DIALOGFLOW_PROJECT_ID', None)
                language_code = "ja-JP"
                session_id    = str(uuid.uuid4())

                try:
                    results   = post_intent_texts(project_id, session_id, texts, language_code)
                    send_text = results[0]["fulfillment"]
                except:
                    send_text = "わかりませんでした。"

            else:
                id = message["id"]
                text = "受信しました：ID={}:".format(id)
                send_text = "現在開発中です。もう少しお待ちください。\n\n開発用ログ：\n" + text

            reply_text(reply_token, send_text)

        #handler.handle(body, signature)

    except InvalidSignatureError:
        logger.error("Invalid signature. Please check your channel access token/channel secret.")
        HttpResponseForbidden()

    except Exception as e:
        logger.error("Error: {}".format(e))


    return HttpResponse('OK', status=200)

#--------------------------------------------------
"""
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
    #text = event.message.text
    text = LINE_APP_URL

    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=text)
    )
"""
