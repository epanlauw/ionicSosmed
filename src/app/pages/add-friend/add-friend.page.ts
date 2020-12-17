import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, IonSearchbar, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  userEmail: string;
  userID: string;
  photo: SafeResourceUrl;
  user: any ;
  user2: any;
  userName: string;
  userAll: any;
  friends: any;
  public searchTerm: string = "";

  @ViewChild('mySearchbar') searchbar: IonSearchbar;


  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController 
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.authSrv.userDetails().subscribe(res => {
    console.log('res: ', res);
    console.log('uid ', res.uid);
    if(res !== null){
      this.userEmail = res.email;
      this.userSrv.getAll('user').snapshotChanges().pipe(
        map(changes => 
          changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
        )
      ).subscribe(data => {
        this.user = data;
        this.user2 = data;
        console.log(this.user);
        console.log(this.userEmail);
        this.user = this.user.filter(User => {
            return User.email !== this.userEmail
        });
        this.user2 = this.user2.filter(User2 => {
          return User2.email == this.userEmail
        });
        this.userName = this.user2[0].nDepan;
        console.log(this.userName);
        this.userSrv.getFriend(this.userName).snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
          )
        ).subscribe(data2 => {
            this.friends = data2;
            console.log(this.friends);
            for(let i = 0; i < this.friends.length;){
              this.user = this.user.filter(User3 => {
                return User3.email !== this.friends[i].email;
              });
              i++;
          }
          this.userAll = this.user;
          console.log(this.userAll);
        });
      });
    }else {
      this.navCtrl.navigateBack('');
    }
  }, err => {
    console.log(err);
  });
}


  setFilteredItems() {
    this.user = this.userAll
    this.user = this.userSrv.filterItems(this.searchTerm,this.user);
  }

  async presentToast(){
    let toast = this.toastCtrl.create({
      message: 'Teman Telah Ditambah',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Tambah Teman....",
      duration: 5000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }

  addFriend(add_user){
    this.presentLoading().then(() => {
      this.user = this.userAll;
      add_user.key = null;
      this.userSrv.addFriend(add_user,add_user.imageUrl,this.userName).then(res => {
        console.log(res);
        this.user = this.user.filter(User4 => {
          console.log(add_user.email);
          return User4.email !== add_user.email;
        });
        this.userAll = this.user;
        console.log(this.user);
        console.log(this.userAll);
        this.presentToast();
        this.searchbar.ionClear
      });
    });

  }

}
