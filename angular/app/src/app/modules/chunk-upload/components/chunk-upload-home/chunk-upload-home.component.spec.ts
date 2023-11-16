import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkUploadHomeComponent } from './chunk-upload-home.component';

describe('ChunkUploadHomeComponent', () => {
  let component: ChunkUploadHomeComponent;
  let fixture: ComponentFixture<ChunkUploadHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunkUploadHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChunkUploadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
