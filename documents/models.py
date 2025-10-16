from django.db import models
import os


class Document(models.Model):
     DOCUMENT_TYPES = (
         ('pdf', 'PDF'),
         ('docx', 'Word Document'),
         ('pptx', 'PowerPoint'),
     )
    
     PROCESSING_STATUS = (
         ('pending', 'Pending'),
         ('processing', 'Processing'),
        ('completed', 'Completed'),
         ('failed', 'Failed'),
     )
    
    #  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
     name = models.CharField(max_length=255, blank=True)
     document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES, null=True, blank=True)
     file = models.FileField(upload_to='documents/%Y/%m/%d/')
    
     # Processing status
     processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')
     processing_error = models.TextField(blank=True, null=True)
    
#     # Metadata
     file_size = models.IntegerField(blank=True, null=True)
    
     uploaded_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
    
     class Meta:
         ordering = ['-uploaded_at']
    
     def __str__(self):
         return f"{self.name} - {self.user.username}"
    
     def save(self, *args, **kwargs):
         if self.file:
             # Extract name from filename
             file_name = os.path.splitext(os.path.basename(self.file.name))[0]
             file_extension = os.path.splitext(self.file.name)[1].lower()
            
             if not self.name:
                 self.name = file_name
            
             # Map extension to document type
             extension_map = {
                 '.pdf': 'pdf',
                 '.docx': 'docx',
                 '.pptx': 'pptx',
             }
             self.document_type = extension_map.get(file_extension, '')
            
             # Store file size
             if hasattr(self.file, 'size'):
                 self.file_size = self.file.size
        
         super().save(*args, **kwargs)