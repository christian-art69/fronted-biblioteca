import { ComponentFixture, TestBed } from '@angular/core/testing';

// CORREGIDO: La importación apuntaba a '.service.ts' en lugar de al componente
import { Prestamos } from './prestamos';

describe('Prestamos', () => {
  let component: Prestamos;
  let fixture: ComponentFixture<Prestamos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestamos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prestamos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});