import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';

export interface ApiValidationError {
  type?: string;
  title?: string;
  status?: number;
  errors?: { [key: string]: string[] };
  traceId?: string;
}

export interface ErrorDisplayOptions {
  duration?: number;
  showSnackbar?: boolean;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

  /**
   * Processes API validation errors and returns formatted error messages
   */
  processApiError(error: HttpErrorResponse | any): string {
    if (this.isValidationError(error)) {
      return this.formatValidationErrors(error.error as ApiValidationError);
    }
    
    return this.getGenericErrorMessage(error);
  }

  /**
   * Displays error message to user via snackbar
   */
  async displayError(
    error: HttpErrorResponse | any, 
    options: ErrorDisplayOptions = {}
  ): Promise<void> {
    let errorMessage: string;
    
    // If the error body is a Blob, we need to read it first
    if (error?.error instanceof Blob) {
      try {
        const errorText = await this.blobToText(error.error);
        const parsedError = JSON.parse(errorText);
        
        // Create a new error object with the parsed content
        const processedError = {
          ...error,
          error: parsedError
        };
        
        errorMessage = this.processApiError(processedError);
      } catch (e) {
        errorMessage = this.getGenericErrorMessage(error);
      }
    } else {
      errorMessage = this.processApiError(error);
    }
    
    if (options.showSnackbar !== false) {
      this.showErrorSnackbar(errorMessage, options);
    }
  }

  private blobToText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
  }

  private formatValidationErrors(apiError: ApiValidationError): string {
    if (!apiError.errors) {
      return apiError.title || this.translocoService.translate('errors.validation_error');
    }

    const errorMessages: string[] = [];
    
    // Process each field's validation errors - completely generic
    Object.entries(apiError.errors).forEach(([fieldKey, messages]) => {
      // Each messages is an array of strings
      if (Array.isArray(messages)) {
        messages.forEach(message => {
          // Format with bullet point and extra line break: "• FieldName: Error message\n"
          errorMessages.push(`• ${fieldKey}: ${message}\n`);
        });
      }
    });
    
    return errorMessages.length > 0 
      ? errorMessages.join('') 
      : apiError.title || this.translocoService.translate('errors.validation_error');
  }

  private isValidationError(error: any): boolean {
    // If error body is a Blob, we can't check its contents here
    // We'll handle this in displayError method
    if (error?.error instanceof Blob) {
      return false; // Will be processed in displayError
    }
    
    return error?.error?.errors && 
           typeof error.error.errors === 'object' &&
           error?.status === 400;
  }

  private getGenericErrorMessage(error: any): string {
    // Check for different error message locations
    if (error?.error?.title) return error.error.title;
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    if (typeof error?.error === 'string') return error.error;
    
    // Status-based messages using translations
    const statusKey = `errors.${error?.status}`;
    const translatedMessage = this.translocoService.translate(statusKey);
    
    // If translation exists (not the same as the key), use it
    if (translatedMessage !== statusKey) {
      return translatedMessage;
    }
    
    // Fallback to default error message
    return this.translocoService.translate('errors.default');
  }

  private showErrorSnackbar(message: string, options: ErrorDisplayOptions): void {
    const duration = options.duration || (message.includes('\n') ? 8000 : 5000);
    const panelClass = options.panelClass || ['error-snackbar'];
    
    this.snackBar.open(message, this.translocoService.translate('common.close'), {
      duration,
      panelClass,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}