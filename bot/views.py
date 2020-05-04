from django.shortcuts import render
from django.http import HttpResponseForbidden, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    LineBotApiError, InvalidSignatureError
)
"""
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    SourceUser, SourceGroup, SourceRoom,
    TemplateSendMessage, ConfirmTemplate, MessageAction,
    ButtonsTemplate, ImageCarouselTemplate, ImageCarouselColumn, URIAction,
    PostbackAction, DatetimePickerAction,
    CameraAction, CameraRollAction, LocationAction,
    CarouselTemplate, CarouselColumn, PostbackEvent,
    StickerMessage, StickerSendMessage, LocationMessage, LocationSendMessage,
    ImageMessage, VideoMessage, AudioMessage, FileMessage,
    UnfollowEvent, FollowEvent, JoinEvent, LeaveEvent, BeaconEvent,
    MemberJoinedEvent, MemberLeftEvent,
    FlexSendMessage, BubbleContainer, ImageComponent, BoxComponent,
    TextComponent, SpacerComponent, IconComponent, ButtonComponent,
    SeparatorComponent, QuickReply, QuickReplyButton,
    ImageSendMessage)
"""
from linebot.models import (
    MessageEvent, TextSendMessage,StickerSendMessage, LocationSendMessage,
    ImageMessage, VideoMessage, AudioMessage
    )

import os
#import json

#import datetime
import errno
#import sys
import tempfile

from .dialogflow.detect_intent_texts import post_intent_texts
import uuid

#--------------------------------------------------
import logging
logger = logging.getLogger('bot')

#--------------------------------------------------

# 各クライアントライブラリのインスタンス作成
CHANNEL_ACCESS_TOKEN = os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET = os.environ["CHANNEL_SECRET"]

line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
handler      = WebhookHandler(CHANNEL_SECRET)

# tmp directory
static_tmp_path = os.path.join(os.path.dirname(__file__), 'static', 'tmp')

#--------------------------------------------------
'''
def reply_text(reply_token, text):
    REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply'

    HEADER = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    }


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
'''

#--------------------------------------------------
# function for create tmp dir for download content
def make_static_tmp_dir():
    try:
        os.makedirs(static_tmp_path)
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(static_tmp_path):
            pass
        else:
            raise

#--------------------------------------------------
@csrf_exempt
def callback(request):
    '''
    Callback 関数
    :param request:
    :return:
    '''

    try:
        # リクエストヘッダーから署名検証のための値を取得
        # get X-Line-Signature header value
        signature = request.headers['X-Line-Signature']

        # リクエストボディを取得
        body = request.body.decode('utf-8')
        logger.debug("Request body: " + body)

        # 署名を検証し、問題なければhandleに定義されている関数を呼び出す
        # handle webhook body
        handler.handle(body, signature)

    except LineBotApiError as e:
        logger.error("Line Bot API error: {}".format(e))
        HttpResponseForbidden()

    except InvalidSignatureError:
        # 署名検証で失敗したときは例外をあげる
        logger.error("Invalid signature. Please check your channel access token/channel secret.")
        HttpResponseForbidden()

    except Exception as e:
        logger.error("Error: {}".format(e))

    # handleの処理を終えればOK
    return HttpResponse('OK', status=200)

#--------------------------------------------------
# see also:
# Messaging API reference
#  * https://developers.line.biz/en/reference/messaging-api/
#  * https://github.com/line/line-bot-sdk-python/blob/master/examples/flask-kitchensink/app.py#L48
#--------------------------------------------------
@handler.add(MessageEvent)
def handle_message(event, destination):
    '''

    :param event: webhook イベントの一覧を表示します
    :param destination: webhook イベントを受信すべきボットのユーザー ID
    :return:
    '''

    # see also: https://qiita.com/q_masa/items/c9db3e8396fb62cc64ed
    if event.reply_token == '00000000000000000000000000000000':
        return

    type = event.message.type
    timestamp = event.timestamp  # イベントの発生時刻（ミリ秒）

    # イベントの送信元情報を含むユーザー、グループ、トークルーム
    # source_type == "user"  or "group" or "room"
    # source_user_id -> 送信元ユーザーのID
    source_type    = event.source.type
    source_user_id = event.source.user_id

    #logger.debug("handle_text_message: type = " + type)

    if type == 'text':
        handle_text_message(event)

    elif type == 'location':
        handle_location_message(event)

    elif type == 'sticker':
        handle_sticker_message(event)

    elif type == 'image':
        handle_content_message(event)

#--------------------------------------------------
def handle_text_message(event):

    text = event.message.text

    if text == '#add':
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text=event.message.text))
    elif text == '#update':
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text=event.message.text))
    else:
        texts = [ text ]
        project_id = os.environ.get('DIALOGFLOW_PROJECT_ID', None)
        language_code = 'ja-JP'
        session_id = str(uuid.uuid4())

        try:
            results = post_intent_texts(project_id, session_id, texts, language_code)
            send_text = results[0]['fulfillment']
        except:
            send_text = 'わかりませんでした。'

        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=send_text)
        )

#--------------------------------------------------
def handle_location_message(event):

    line_bot_api.reply_message(
        event.reply_token,
        LocationSendMessage(
            title='Location', address=event.message.address,
            latitude=event.message.latitude, longitude=event.message.longitude
        )
    )

#--------------------------------------------------
def handle_sticker_message(event):

    # 使用可能スタンプ
    # LINE CorporationAvailable sticker list
    # https://developers.line.biz/media/messaging-api/sticker_list.pdf

    #package_id = event.message.package_id  # パッケージID
    #sticker_id = event.message.sticker_id  # スタンプID
    package_id = 11537
    sticker_id = 52002739

    line_bot_api.reply_message(
        event.reply_token,
        StickerSendMessage(
            package_id=package_id,  # パッケージID
            sticker_id=sticker_id)  # スタンプID
        )

#--------------------------------------------------
def handle_content_message(event):

    if isinstance(event.message, ImageMessage):
        ext = 'jpg'
    elif isinstance(event.message, VideoMessage):
        ext = 'mp4'
    elif isinstance(event.message, AudioMessage):
        ext = 'm4a'
    else:
        return

    content_type = event.message.content_provider.type

    if content_type == "line":
        make_static_tmp_dir()

        message_content = line_bot_api.get_message_content(event.message.id)
        with tempfile.NamedTemporaryFile(dir=static_tmp_path, prefix=ext + '-', delete=False) as tf:
            for chunk in message_content.iter_content():
                tf.write(chunk)
            tempfile_path = tf.name

        dist_path = tempfile_path + '.' + ext
        dist_name = os.path.basename(dist_path)
        os.rename(tempfile_path, dist_path)

        #import requests
        #send_text = "save content." + requests.host_url + os.path.join('static', 'tmp', dist_name)
        send_text = "save content = " + os.path.join('static', 'tmp', dist_name)

        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=send_text)
        )

    elif content_type == "external":
        originalContentUrl = event.message.content_provider.original_content_url
        previewImageUrl    = event.message.content_provider.preview_image_url

        send_text = "originalContentUrl = " + originalContentUrl + "previewImageUrl = " + previewImageUrl

        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=send_text)
        )
