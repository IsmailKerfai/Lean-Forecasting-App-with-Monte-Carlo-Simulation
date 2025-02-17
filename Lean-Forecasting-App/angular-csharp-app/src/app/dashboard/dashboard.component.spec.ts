import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection', () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const event = {
      target: { files: [file] }
    } as unknown as Event;

    spyOn(component, 'onFileSelected');
    component.onFileSelected(event);

    expect(component.onFileSelected).toHaveBeenCalledWith(event);
  });

  it('should update the message when updateMessage is called', () => {
    component.updateMessage();
    expect(component.message).toBe('Button wurde geklickt!');
  });

  it('should reset the message when resetMessage is called', () => {
    component.resetMessage();
    expect(component.message).toBe('Willkommen bei der Beispiel-Komponente!');
  });
});
