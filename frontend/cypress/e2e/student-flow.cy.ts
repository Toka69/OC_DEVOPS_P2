describe('End-to-End Student Management Flow (Mocked API)', () => {

  beforeEach(() => {
    // GIVEN: Mocking the authentication and student APIs
    cy.intercept('POST', '/auth/register', { statusCode: 201, body: {} }).as('registerUser');
    cy.intercept('POST', '/auth/login', { statusCode: 200, body: { token: 'mock-jwt-token' } }).as('loginUser');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'John', lastName: 'Doe', login: 'jdoe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', login: 'jsmith' }
      ]
    }).as('getStudents');

    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: { id: 1, firstName: 'John', lastName: 'Doe', login: 'jdoe' }
    }).as('getStudentDetail');

    cy.intercept('POST', '/api/students', { statusCode: 200, body: { id: 3, firstName: 'New', lastName: 'Student' } }).as('createStudent');
    cy.intercept('PATCH', '/api/students/1', { statusCode: 200, body: {} }).as('patchStudent');
    cy.intercept('DELETE', '/api/students/2', { statusCode: 204, body: {} }).as('deleteStudent');
  });

  it('should navigate through all screens successfully', () => {
    // 1. HOME & REGISTER
    // WHEN: Visiting home and navigating to register
    cy.visit('/');
    cy.visit('/register');
    cy.get('input[formControlName="firstName"]').type('Agent');
    cy.get('input[formControlName="lastName"]').type('Test');
    cy.get('input[formControlName="login"]').type('agent_login');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    // THEN: Registration call should be intercepted
    cy.wait('@registerUser');
    cy.contains('User registered successfully!').should('be.visible');

    // 2. LOGIN
    // WHEN: Logging in
    cy.visit('/login');
    cy.get('input[formControlName="login"]').type('agent_login');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginUser');
    // THEN: Should reach the list
    cy.url().should('include', '/students/list');
    cy.wait('@getStudents');

    // 3. STUDENT DETAIL
    // WHEN: Clicking on detail for John Doe (ID 1)
    cy.visit('/students/detail/1');
    cy.wait('@getStudentDetail');
    // THEN: Details should be visible
    cy.contains('John').should('be.visible');
    cy.contains('Doe').should('be.visible');

    // 4. STUDENT CREATE
    // WHEN: Navigating to creation page
    cy.visit('/students/create');
    cy.get('input[formControlName="firstName"]').type('New');
    cy.get('input[formControlName="lastName"]').type('Student');
    cy.get('input[formControlName="login"]').type('new_std');
    cy.get('input[formControlName="password"]').type('pass');
    cy.get('button[type="submit"]').click();
    // THEN: Creation call should be made
    cy.wait('@createStudent');
    cy.url().should('include', '/students/list');

    // 5. STUDENT EDIT
    // WHEN: Navigating to edit page for John Doe
    cy.visit('/students/edit/1');
    cy.wait('@getStudentDetail');
    cy.get('input[formControlName="firstName"]').clear().type('JohnUpdated');
    cy.get('button[type="submit"]').click();
    // THEN: Patch call should be made
    cy.wait('@patchStudent');
    cy.url().should('include', '/students/list');
  });
});
