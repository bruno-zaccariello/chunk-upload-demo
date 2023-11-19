import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkUploadLotComponent } from './chunk-upload-lot.component';

describe('ChunkUploadLotComponent', () => {
  let component: ChunkUploadLotComponent;
  let fixture: ComponentFixture<ChunkUploadLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunkUploadLotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChunkUploadLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
