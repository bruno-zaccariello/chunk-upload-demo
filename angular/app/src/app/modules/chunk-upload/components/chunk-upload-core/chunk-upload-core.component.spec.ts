import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkUploadCoreComponent } from './chunk-upload-core.component';

describe('ChunkUploadCoreComponent', () => {
  let component: ChunkUploadCoreComponent;
  let fixture: ComponentFixture<ChunkUploadCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunkUploadCoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChunkUploadCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
