import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugHomeComponent } from './debug-home.component';

describe('DebugHomeComponent', () => {
  let component: DebugHomeComponent;
  let fixture: ComponentFixture<DebugHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebugHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
