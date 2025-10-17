from celery import shared_task
from pathlib import Path
from .models import Document
import traceback
from RAG_BACKEND.loaders import pdf_loader, pptx_loader, docxloader
from RAG_BACKEND.embedding import Embedding


@shared_task(bind=True)
def embed_document(self, document_id):
    """Background task to embed document"""
    try:
        document = Document.objects.get(id=document_id)
        
        # Update progress - Stage 1: Loading file
        self.update_state(state='PROGRESS', meta={'current': 20, 'total': 100, 'status': 'Loading document...'})
        
        file_path = Path(document.file.path)
        print(f'Embedding: {file_path}')

        # Stage 2: Extract content
        ext = file_path.suffix.lower()
        if ext == '.pdf' and document.document_type == 'pdf':
            chunks = pdf_loader.PDFLoader(str(file_path)).load()
        elif ext == '.pptx' and document.document_type == 'pptx':
            chunks = pptx_loader.PptxLoader(str(file_path)).load()
        elif ext == '.docx' and document.document_type == 'docx':
            chunks = docxloader.DocxLoader(str(file_path)).load()
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        if not chunks:
            raise ValueError("No content extracted from document")

        # Update progress - Stage 2: Extracted content
        self.update_state(state='PROGRESS', meta={'current': 40, 'total': 100, 'status': 'Extracted content, creating embeddings...'})

        # Stage 3: Create embeddings
        user_id = 1  # Or get from request.user
        embed = Embedding(str(file_path), chunks)
        embed.set_embedding_model(model_type='huggingface', model_name='sentence-transformers/all-mpnet-base-v2')
        
        # Update progress - Stage 3: Embedding in progress
        self.update_state(state='PROGRESS', meta={'current': 70, 'total': 100, 'status': 'Creating vector embeddings...'})
        
        # Save vectorstore
        vectorstore = embed.create_or_load_vectorstore(userId=user_id)
        
        # Update progress - Stage 4: Saving
        self.update_state(state='PROGRESS', meta={'current': 90, 'total': 100, 'status': 'Saving vectorstore...'})
        
        # Update document
        document.vectorstore_path = str(vectorstore.persist_directory)
        document.processing = False
        document.save()

        print(f"✓ Embedding completed for document {document.name} (User {user_id})")
        
        # Final update
        return {'current': 100, 'total': 100, 'status': 'Embedding complete!', 'document_id': document_id}

    except Exception as e:
        traceback.print_exc()
        # Mark document as failed
        try:
            document = Document.objects.get(id=document_id)
            document.processing_status = 'completed'
            document.save()
        except:
            pass
        
        # Fail the task
        self.update_state(state='FAILURE', meta={'error': str(e)})
        raise