from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('add-transaction/', views.add_transaction, name='add_transaction'),
    path('list-transactions/', views.list_transactions, name='list_transactions'),
    path('login/', views.login_view, name='login'),
    path('settings/', views.settings_view, name='settings'),
    path('dashboard/', views.dashboard, name='dashboard'),
]