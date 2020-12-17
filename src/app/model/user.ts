import { SafeResourceUrl } from '@angular/platform-browser';

export class User {
    key: string;
    imageUrl: SafeResourceUrl;
    nama_depan: string;
    nama_belakang: string;
    email: string;
    constructor(key: string, nama_depan: string, nama_belakang: string, imageUrl: SafeResourceUrl, email: string){}
}