import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

export class User {
    id: number;
    username: string;
    email: string;
}

export class CustomerDetailsModel {
    id: number;
    username: string;
    email: string;
    UserType: number;
    contactNumber: string;
    address: string;
    totalProperties: number;
    name: string;
}

export class Album {
    userId: number;
    id: number;
    title: string;
  
    static asFormGroup(album: Album): UntypedFormGroup {
      const fg = new UntypedFormGroup({
        userId: new UntypedFormControl(album.userId, Validators.required),
        id: new UntypedFormControl(album.id, Validators.required),
        title: new UntypedFormControl(album.title, Validators.required)
      });
      return fg;
    }
  }