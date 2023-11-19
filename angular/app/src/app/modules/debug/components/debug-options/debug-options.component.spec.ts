import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugOptionsComponent } from './debug-options.component';

describe('DebugOptionsComponent', () => {
  let component: DebugOptionsComponent;
  let fixture: ComponentFixture<DebugOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebugOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
