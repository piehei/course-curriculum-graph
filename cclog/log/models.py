from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass


class LogEntry(models.Model):

    CONNECTION = 'connection'
    LOCATION = 'location'

    LOG_ENTRY_TYPES = (
        (CONNECTION, 'connection'),
        (LOCATION, 'location')
    )

    entry_type = models.CharField(
        max_length=20,
        choices=LOG_ENTRY_TYPES,
    )

    user = models.ForeignKey(User, related_name='log_entries', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    payload = JSONField()
