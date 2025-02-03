from django.shortcuts import render, redirect
from .models import Transaction
from django.http import JsonResponse
import json
from django.db.models import Q
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
# Create your views here.

def home(request):
    return render(request, 'mk_management/home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')  # Redirect to the dashboard
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'mk_management/login.html')

@login_required
def settings_view(request):
    if request.method == 'POST':
        if 'change_password' in request.POST:
            password_form = PasswordChangeForm(user=request.user, data=request.POST)
            if password_form.is_valid():
                password_form.save()
                update_session_auth_hash(request, password_form.user)
                messages.success(request, 'Your password was successfully updated!')
            else:
                messages.error(request, 'Please correct the error below.')
        elif 'add_user' in request.POST and request.user.is_superuser:
            username = request.POST.get('new_username')
            password = request.POST.get('new_password')
            User.objects.create_user(username=username, password=password)
            messages.success(request, f'User {username} created successfully.')
    else:
        password_form = PasswordChangeForm(user=request.user)

    return render(request, 'mk_management/settings.html', {'password_form': password_form})


def dashboard(request):
    return render(request, 'mk_management/dashboard.html')

def add_transaction(request):
    return render(request, 'mk_management/add_transaction.html')

def add_transaction(request):
    if request.method == "POST":
        data = json.loads(request.body)
        transactions = data.get('transactions', [])
        for trans in transactions:
            fields = trans.split(',')
            item_name, price, quantity, total, customer_name = fields
            Transaction.objects.create(
                item_name=item_name,
                price=float(price),
                quantity=int(quantity),
                total=float(total),
                customer_name=customer_name,
            )
        return JsonResponse({'status': 'success'})
    return render(request, 'mk_management/add_transaction.html')


def list_transactions(request):
    item_name = request.GET.get('item_name', '')
    customer_name = request.GET.get('customer_name', '')
    date_of_transaction = request.GET.get('date_of_transaction', '')

    # Use Q objects for OR filtering
    filters = Q()
    if item_name:
        filters |= Q(item_name__icontains=item_name)
    if customer_name:
        filters |= Q(customer_name__icontains=customer_name)
    if date_of_transaction:
        filters |= Q(date_of_transaction=date_of_transaction)

    transactions = Transaction.objects.filter(filters).order_by('-id')[:5]

    return render(request, 'mk_management/list_transactions.html', {'transactions': transactions})