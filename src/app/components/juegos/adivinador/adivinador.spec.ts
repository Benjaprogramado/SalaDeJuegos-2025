import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adivinador } from './adivinador';

describe('Adivinador', () => {
  let component: Adivinador;
  let fixture: ComponentFixture<Adivinador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adivinador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adivinador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
