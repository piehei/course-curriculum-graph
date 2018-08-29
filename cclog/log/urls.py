
from django.urls import path

from . import views

app_name = 'log'

urlpatterns = [

    path('<str:user_id>/', views.LogEntryList.as_view(), name='LogEntryList'),

]
