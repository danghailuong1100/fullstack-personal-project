
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'cypress2022',
      password: 'cypress2022',
      name: 'Cypress Test'
    })
    localStorage.removeItem('currentUser')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {

    it('succeeds with correct credentials', function() {
      cy.get(':nth-child(1) > input').type('cypress2022')
      cy.get(':nth-child(2) > input').type('cypress2022')
      cy.get('button').click()
      cy.contains('Cypress Test logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get(':nth-child(1) > input').type('cypress2022')
      cy.get(':nth-child(2) > input').type('cypress2023')
      cy.get('button').click()
      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cypress2022', password: 'cypress2022' })
      cy.createBlog({ title: 'The first test blog', author: 'Cypress', url: 'https://cypress.dev' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get(':nth-child(1) > input').type('a new blog test title')
      cy.get(':nth-child(2) > input').type('a new blog test author')
      cy.get(':nth-child(3) > input').type('https://example.com')
      cy.contains('save').click()

      cy.contains('a new blog test title')
      cy.contains('a new blog test author')
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
      cy.contains('like').click()
      cy.contains('2')
    })

    it('A blog can be deleted', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('The first test blog').should('not.exist')
    })

    it('Blogs should be sorted by likes, with most likes being first', function() {
      cy.contains('new blog').click()
      cy.get(':nth-child(1) > input').type('a new blog test title')
      cy.get(':nth-child(2) > input').type('a new blog test author')
      cy.get(':nth-child(3) > input').type('https://example.com')
      cy.contains('save').click()

      cy.get('.blog_view_btn').eq(1).click()
      cy.contains('like').click()
      cy.contains('1')

      cy.get('.blog').eq(0).should('contain', 'a new blog test title')
      cy.get('.blog').eq(1).should('contain', 'The first test blog')
    })
  })
})
