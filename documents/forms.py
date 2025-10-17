from django import forms
from .models import Document
import os
from django.core.exceptions import ValidationError

class DocumentUploadForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['file']
        widgets = {
            'file': forms.FileInput(attrs={
                'accept': '.pdf,.doc,.docx,.txt,.ppt,.pptx',
                'class': 'file-input',
                'id': 'fileInput'
            })
        }

    def clean_file(self):
        file = self.cleaned_data['file']
        if not file:
            raise ValidationError('Please select a file to upload.')
        
        # Check file size (e.g., max 50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        if file.size > max_size:
            raise ValidationError('File size must be less than 50MB.')
        
        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']
        file_extension = os.path.splitext(file.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise ValidationError(
                f'File type not supported. Allowed types: {", ".join(allowed_extensions)}'
            )
        
        return file

    def save(self, commit=True, user=None, **kwargs):
        instance = super().save(commit=False)
        # Set user if provided (uncomment when user field is active in model)
        # instance.user = user
        if commit:
            instance.save()
        return instance