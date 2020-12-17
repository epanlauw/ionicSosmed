import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowFriendPage } from './show-friend.page';

describe('ShowFriendPage', () => {
  let component: ShowFriendPage;
  let fixture: ComponentFixture<ShowFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFriendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
