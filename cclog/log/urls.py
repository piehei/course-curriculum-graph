
from django.urls import path

from . import views

app_name = 'log'

urlpatterns = [

    path('', views.LogEntryList.as_view(), name='LogEntryList'),

]
