import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticleBg } from './particle-bg';

describe('ParticleBg', () => {
  let component: ParticleBg;
  let fixture: ComponentFixture<ParticleBg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticleBg],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticleBg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
