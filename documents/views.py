from django.shortcuts import render
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .forms import DocumentUploadForm
import traceback
from django.views.decorators.http import require_http_methods
from .models import Document
from RAG_BACKEND.loaders import pdf_loader, pptx_loader, docxloader
from RAG_BACKEND.embedding import Embedding
from pathlib import Path
from django.conf import settings

def upload_document(request):
    """Handle document upload - both form display and AJAX upload"""
    
    # Handle AJAX POST requests (from JavaScript)
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        try:
            # Validate file exists
            if 'file' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'error': 'No file provided'
                }, status=400)

            file = request.FILES['file']

            if len(file.name) > 100:
                return JsonResponse({
                    'success': False,
                    'error': 'File name must be less than 100 characters'
                }, status=400)
            
            # Create form with the file
            form = DocumentUploadForm(request.POST, request.FILES)
            
            if form.is_valid():
                # Save the document
                document = form.save(commit=False)
                
                # Use filename as document name
                document.name = file.name
                
                # Uncomment when user field is active in model
                # document.user = request.user
                document.save()

                file_path = Path(document.file.path)
                print(f'{file_path}')

                ext = file_path.suffix.lower()
                if ext == '.pdf' and document.document_type == 'pdf':
                    chunks = pdf_loader.PDFLoader(str(file_path)).load()

                elif ext == '.pptx' and document.document_type == 'pptx':
                    chunks = pptx_loader.PptxLoader(str(file_path)).load()
                
                elif ext == '.docx' and document.document_type == 'docx':
                    chunks = docxloader.DocxLoader(str(file_path)).load()

                else:
                    return JsonResponse({
                        'success': False,
                        'error': f"Unsupported file type: {ext}"
                    }, status=400)
                
                if not chunks:
                    return JsonResponse({
                        'success': False,
                        'error': "No content extracted from document"
                    }, status=400)

                #Embedding Phase
                #user_id = request.user.id if request.user.is_authenticated else document.id
                user_id = 1
                embed = Embedding(str(file_path), chunks)
                embed.set_embedding_model(model_type='huggingface', model_name='sentence-transformers/all-mpnet-base-v2')
                
                # Save embeddings for this user/document in persistent vectorstore
                vectorstore, persist_dir = embed.create_or_load_vectorstore(userId=user_id)
                print(f"Embedding created for document {document.name} (User {user_id})")

                # You can also store vectorstore path if needed
                document.vectorstore_path = str(persist_dir)
                document.save()

                return JsonResponse({
                    'success': True,
                    'message': 'File uploaded and Embedded Successfully successfully',
                    'document_id': document.id,
                    'filename': file.name,
                    'document_name': document.name
                }, status=201)
            
            else:
                # Return form validation errors
                errors = {field: error[0] for field, error in form.errors.items()}
                return JsonResponse({
                    'success': False,
                    'error': 'Form validation failed',
                    'errors': errors
                }, status=400)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({
                'success': False,
                'error': f'Upload or Embedding failed: {str(e)}'
            }, status=500)
    
    # Handle GET requests (show form page)
    else:
        form = DocumentUploadForm()

        recent_documents = Document.objects.all().order_by('-uploaded_at')[:5]

        return render(request, 'index.html', {
            'form': form,
            'recent_documents':recent_documents
            })




def chat(request):
    return render(request, 'chat.html')