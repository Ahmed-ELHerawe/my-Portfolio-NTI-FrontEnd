import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjects } from './manage-projects';

describe('ManageProjects', () => {
  let component: ManageProjects;
  let fixture: ComponentFixture<ManageProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProjects],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
