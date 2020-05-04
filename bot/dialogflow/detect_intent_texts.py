import argparse
import uuid

#from google.api_core.exceptions import InvalidArgument

# import dialogflow
import dialogflow_v2 as dialogflow

#--------------------------------------------------
import logging
logger = logging.getLogger('bot')

#------------------------------------------------------
def post_intent_texts(project_id, session_id, texts, language_code):
    """
    Returns the result of detect intent with texts as inputs.
    Using the same `session_id` between requests allows continuation
    of the conversation.
    """

    result = []

    try:
        session_client = dialogflow.SessionsClient()

        session = session_client.session_path(project_id, session_id)
        logger.debug('Session path: {}\n'.format(session))

        for text in texts:
            text_input = dialogflow.types.TextInput(
                text=text, language_code=language_code)

            query_input = dialogflow.types.QueryInput(text=text_input)

            response = session_client.detect_intent(session=session, query_input=query_input)

            logger.debug('=' * 20)
            logger.debug('Query text: {}'.format(response.query_result.query_text))
            logger.debug('Detected intent: {} (confidence: {})'.format(
                response.query_result.intent.display_name, response.query_result.intent_detection_confidence))
            logger.debug('Fulfillment text: {}'.format(response.query_result.fulfillment_text))

            data = {
                "query": response.query_result.query_text,
                "intent": response.query_result.intent.display_name,
                "confidence": response.query_result.intent_detection_confidence,
                "fulfillment": response.query_result.fulfillment_text
            }
            result.append(data)

    except Exception as e:
        logger.error('post_intent_texts(): {}'.format(e))

    return result

#------------------------------------------------------
'''
def post_intent_texts(project_id, session_id, texts, language_code):

    for text_to_be_analyzed in texts:
        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(project_id, session_id)
        text_input = dialogflow.types.TextInput(text=text_to_be_analyzed, language_code=language_code)
        query_input = dialogflow.types.QueryInput(text=text_input)

        try:
            response = session_client.detect_intent(session=session, query_input=query_input)
        except InvalidArgument:
            raise

        print("Query text:", response.query_result.query_text)
        print("Detected intent:", response.query_result.intent.display_name)
        print("Detected intent confidence:", response.query_result.intent_detection_confidence)
        print("Fulfillment text:", response.query_result.fulfillment_text)
        print(response.query_result)
'''


"""DialogFlow API Detect Intent Python sample with text inputs.
Examples:
  python detect_intent_texts.py -h
  python detect_intent_texts.py --project-id PROJECT_ID \
  --session-id SESSION_ID \
  "hello" "book a meeting room" "Mountain View"
  python detect_intent_texts.py --project-id PROJECT_ID \
  --session-id SESSION_ID \
  "tomorrow" "10 AM" "2 hours" "10 people" "A" "yes"
"""
#------------------------------------------------------
# [START dialogflow_detect_intent_text]
'''
def detect_intent_texts(project_id, session_id, texts, language_code):
    """
    Returns the result of detect intent with texts as inputs.
    Using the same `session_id` between requests allows continuation
    of the conversation.
    """

    session_client = dialogflow.SessionsClient()

    session = session_client.session_path(project_id, session_id)
    print('Session path: {}\n'.format(session))

    for text in texts:
        text_input = dialogflow.types.TextInput(
            text=text, language_code=language_code)

        query_input = dialogflow.types.QueryInput(text=text_input)

        response = session_client.detect_intent(
            session=session, query_input=query_input)

        print('=' * 20)
        print('Query text: {}'.format(response.query_result.query_text))
        print('Detected intent: {} (confidence: {})\n'.format(
            response.query_result.intent.display_name,
            response.query_result.intent_detection_confidence))
        print('Fulfillment text: {}\n'.format(
            response.query_result.fulfillment_text))
'''

'''
# [END dialogflow_detect_intent_text]
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        '--project-id',
        help='Project/agent id.  Required.',
        required=True)
    parser.add_argument(
        '--session-id',
        help='Identifier of the DetectIntent session. '
        'Defaults to a random UUID.',
        default=str(uuid.uuid4()))
    parser.add_argument(
        '--language-code',
        help='Language code of the query. Defaults to "en-US".',
        default='ja-JP')
    parser.add_argument(
        'texts',
        nargs='+',
        type=str,
        help='Text inputs.')

    args = parser.parse_args()

    detect_intent_texts(args.project_id, args.session_id, args.texts, args.language_code)
    #post_intent_texts(args.project_id, args.session_id, args.texts, args.language_code)
'''

