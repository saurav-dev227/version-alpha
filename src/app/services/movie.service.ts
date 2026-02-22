import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models/user';
import { UntypedFormArray } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getMovies(): Observable<any> {
    return this.http.get(this.baseUrl + 'movies/', this.getAuthHeaders());

  }

  private getAuthHeaders(){
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders(
      {'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Token ' + token});
      return { headers: httpHeaders};
  }

  getAll(d): Observable<any> {
    // const url = 'https://jsonplaceholder.typicode.com/albums';
    return this.http.post<any>(this.baseUrl+'albums/', d)
    .pipe(map((albums: Album[]) => {
      return albums
    }));
  }

  getAllAsFormArray(d): Observable<UntypedFormArray> {
    return this.getAll(d).pipe(map((albums: Album[]) => {
      // Maps all the albums into a formGroup defined in tge album.model.ts
      const fgs = albums.map(Album.asFormGroup);
      return new UntypedFormArray(fgs);
    }));
  }
}
