from django.conf import settings

def google_analytics_key(request):
    """
    Returns google_analytics_key.
    """
    context_extras = {}
    if getattr(settings, "GOOGLE_ANALYTICS_KEY", False):
        context_extras = {"google_analytics_key": settings.GOOGLE_ANALYTICS_KEY}

    return context_extras

