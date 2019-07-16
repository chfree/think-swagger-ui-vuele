describe('主页测试', function() {
  it('登陆', function() {
    cy.login('admin', 'admin')
  })

  it('测试个人信息是否可以正常点击', function(){
  
    cy.get('.avatar-wrapper')
    .click()
    .wait(1500)
    .click()

  })
})
