from django.db import models

class Transaction(models.Model):
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    customer_name = models.CharField(max_length=200)
    date_of_transaction = models.DateField(auto_now_add=True)  # Automatically set the field to now when the object is first created

    def __str__(self):
        return f"{self.item_name} - {self.customer_name}"