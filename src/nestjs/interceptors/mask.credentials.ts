import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MaskCredentialsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.maskSecrets(data)));
  }

  private maskSecrets(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.maskSecretsInItem(item));
    } else if (typeof data === 'object' && data !== null) {
      return this.maskSecretsInItem(data);
    } else {
      // Return data as is if it's not an object or array
      return data;
    }
  }

  private maskSecretsInItem(item: any): any {
    // Create a shallow copy to avoid mutating the original object
    const newItem = { ...item };

    if (Array.isArray(newItem.credentials)) {
      newItem.credentials = newItem.credentials.map((credential: any) => {
        const newCredential = { ...credential };
        if (newCredential.secret) {
          newCredential.secret = '*** MASKED ***'; // Mask the secret
          // Or remove it: delete newCredential.secret;
        }
        return newCredential;
      });
    }

    // If there are nested objects, recursively mask secrets
    for (const key in newItem) {
      if (newItem.hasOwnProperty(key) && typeof newItem[key] === 'object') {
        newItem[key] = this.maskSecrets(newItem[key]);
      }
    }

    return newItem;
  }
}
