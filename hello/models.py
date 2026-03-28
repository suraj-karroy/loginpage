from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    destination = models.CharField(max_length=100)
    adults = models.IntegerField()
    children = models.IntegerField()
    duration = models.IntegerField()

    def __str__(self):
        return self.destination


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name