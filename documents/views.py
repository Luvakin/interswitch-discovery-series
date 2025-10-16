from django.shortcuts import render
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .forms import DocumentUploadForm

@login_required
def upload_document(request):
    """Handle document upload"""
    if request.method == 'POST':
        form = DocumentUploadForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                document = form.save(user=request.user)
                messages.success(request, f'File "{document.name}" uploaded successfully!')
                return JsonResponse({
                    'success': True,
                    'message': 'File uploaded successfully',
                    'document_id': document.id
                })
            except Exception as e:
                messages.error(request, f'Upload failed: {str(e)}')
                return JsonResponse({
                    'success': False,
                    'message': str(e)
                }, status=400)
        else:
            errors = {}
            for field, error_list in form.errors.items():
                errors[field] = error_list[0] if error_list else 'Invalid input'
            return JsonResponse({
                'success': False,
                'message': 'Form validation failed',
                'errors': errors
            }, status=400)
    else:
        form = DocumentUploadForm()
    return render(request, 'index.html', {'form': form})