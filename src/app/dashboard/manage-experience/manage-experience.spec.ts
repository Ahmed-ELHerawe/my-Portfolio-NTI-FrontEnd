import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExperience } from './manage-experience';

describe('ManageExperience', () => {
  let component: ManageExperience;
  let fixture: ComponentFixture<ManageExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExperience],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageExperience);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
