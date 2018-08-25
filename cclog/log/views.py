from django import forms
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import LogEntry, User

class LogEntryForm(forms.ModelForm):
    class Meta:
        model = LogEntry
        exclude = ['user']

class LogEntrySerializer(serializers.HyperlinkedModelSerializer):

    # time = serializers.TimeField(format='%H:%M', input_formats=None)

    class Meta:
        model = LogEntry
        fields = ["timestamp", "entry_type", "payload"]


class LogEntryList(APIView):

    def get(self, request, format=None):
        entries = LogEntry.objects.all()
        serializer = LogEntrySerializer(entries, many=True)
        payload_list = map(lambda item: item['payload'], serializer.data)
        return Response(payload_list)


    def post(self, request):
        print(request.data)

        user, created = User.objects.get_or_create(
                username=request.META['HTTP_X_USER_ID'],
                )

        payload = request.data
        entry = LogEntry(
                entry_type=payload['type'],
                user=user,
                payload=payload,
                )
        entry.save()

        return Response({ "status": "success", "id": entry.id })
