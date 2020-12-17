import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { SafeResourceUrl } from '@angular/platform-browser';
import { User } from '../model/user';

import { Maps } from '../model/map';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userRef: AngularFireList<User> = null;
  mapRef: AngularFireList<Maps> = null;
    constructor(private db: AngularFireDatabase) {

     }
  
     getAll(dbPath: string): AngularFireList<User> {
       this.userRef = this.db.list('/'+dbPath);
       return this.userRef;
     }
  
     addFriend(user: User ,photo: SafeResourceUrl, dbPath: string): any {
       user.imageUrl = photo;
       this.userRef = this.db.list('/'+dbPath);
       return this.userRef.push(user);
     }

     getFriend(dbPath: string): AngularFireList<User> {
       console.log(dbPath);
       this.userRef = this.db.list('/'+dbPath);
       return this.userRef
     }
     
     createUser(user: User ,photo: SafeResourceUrl): any {
        user.imageUrl = photo;
        this.userRef = this.db.list('/user');
        return this.userRef.push(user);
     }

     update(key: string, value: User , photo: SafeResourceUrl, dbPath: string): Promise<void> {
       value.imageUrl = photo;
       this.userRef = this.db.list('/'+dbPath);
       return this.userRef.update(key, value);
     }
  
     deleteFriend(key: string, dbPath: string): Promise<void> {
       this.userRef = this.db.list('/'+dbPath);
       return this.userRef.remove(key);
     }
  
     deleteAll(dbPath: string): Promise<void> {
        this.userRef = this.db.list('/'+dbPath);
        return this.userRef.remove();
     }

     CurrentLocation(nama_depan: string, location: Maps): any{
       console.log(location);
       location.key = null;
        this.mapRef = this.db.list('/location/'+nama_depan);
        return this.mapRef.push(location);
     }

     getCurrentLocation(nama_depan: string): AngularFireList<Maps> {
        this.mapRef = this.db.list('/location/'+nama_depan);
        return this.mapRef;
     }

     DeleteLocation(key: string,nama_depan: string): Promise<void> {
        this.mapRef = this.db.list('/location/'+nama_depan);
        return this.mapRef.remove(key);
     }

     filterItems(searchTerm, user) {
      return user.filter(item => {
        return item.nDepan.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
    }
}
