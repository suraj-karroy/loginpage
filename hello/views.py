from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Book, Contact


# ========== PAGES ==========
def home(request):
    return render(request, 'index.html')


def destinations(request):
    return render(request, 'destinations.html')


def services(request):
    return render(request, 'services.html')


# ========== BOOKING ==========
def book(request):
    if request.method == 'POST':
        destination = request.POST.get('destination')
        adults = request.POST.get('adults')
        children = request.POST.get('children')
        duration = request.POST.get('duration')

        Book.objects.create(
            user=request.user if request.user.is_authenticated else None,
            destination=destination,
            adults=adults,
            children=children,
            duration=duration
        )

        messages.success(request, "Booking successful!")
        return redirect('home')

    return render(request, 'book.html')


# ========== CONTACT ==========
def contact(request):
    if request.method == 'POST':
        Contact.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            message=request.POST.get('message')
        )

        messages.success(request, "Message sent successfully!")
        return redirect('home')

    return render(request, 'contact.html')


# ========== LOGIN ==========
def user_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Email se user find karo
        user_obj = User.objects.filter(email=email).first()

        if user_obj:
            user = authenticate(request, username=user_obj.username, password=password)

            if user is not None:
                login(request, user)
                messages.success(request, "Login successful!")
                return redirect('home')   # ✅ FIXED

        messages.error(request, "Invalid email or password")

    return render(request, "login.html")


# ========== SIGNUP ==========
def signup(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # Password match check
        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('signup')

        # Username exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect('signup')

        # Email exists
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
            return redirect('signup')

        # Create user
        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        messages.success(request, "Account created! Please login.")
        return redirect('login')

    return render(request, 'signup.html')


# ========== LOGOUT ==========
def user_logout(request):
    logout(request)
    messages.success(request, "Logged out successfully!")
    return redirect('home')