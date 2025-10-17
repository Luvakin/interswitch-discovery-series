from django.urls import path
from . import views

urlpatterns = [
    path('account/login', views.account_login, name='login')
]