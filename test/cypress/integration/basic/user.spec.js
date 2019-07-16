describe('登陆测试', function() {
  it('登陆', function() {
    cy.login('admin', 'admin')
  })

  it('测试跳转到用户信息', function() {
    cy.openMenu('系统管理','用户管理')
  })

  it('测试搜索查询', function() {
    cy.get('input[name="username"]')
    .clear()
    .type('chfree')

    cy.get('input[name="account"]')
    .clear()
    .type('chfree')

    cy.get('input[name="mobile"]')
    .clear()
    .type('110')

    cy.get('#userSearch')
      .click()

    cy.wait(1500)

    cy.get('#resetUserSearch')
      .click()

    cy.get('#userSearch')
      .click()
  })

  it('测试新增', function() {
    cy.get('#addData')
      .click({force:true})
    cy.wait(400)
    let addDialog = '.tc-dialog-body-container'

    cy.field(addDialog,'userModel_name','chfree-test')
    cy.field(addDialog, 'userModel_sex', '女')
    cy.field(addDialog, 'userModel_hobby', '打篮球,羽毛球')
    cy.field(addDialog,'userModel_birthday', '{enter}')
    cy.field(addDialog, 'userModel_education', '硕士')
    

    cy.field(addDialog, 'userModel_nation', '中国').wait(100)
    cy.field(addDialog, 'userModel_province', '湖北省').wait(100)
    cy.field(addDialog, 'userModel_city', '武汉市').wait(100)
    cy.field(addDialog, 'userModel_county', '洪山区').wait(100)
    // cy.get('.tc-dialog-body-container .tc-select[vname="userModel_education"]')
    //   .click({force: true})
    
    
  })

  it('测试编辑', function() {

  })

  it('测试删除', function() {

  })
})