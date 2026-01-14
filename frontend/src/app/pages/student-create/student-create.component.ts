import {Component, inject} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-student-create',
  imports: [
    SidebarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent {
  createForm: FormGroup = new FormGroup({});
  private formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.createForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.createForm.controls;
  }

  onSubmit() {

  }

  onReset() {}
}
