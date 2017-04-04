export default {

  changeMenuClases (value, allMenus, el) {
    // get the other menus others other than the selected one
    let otherMenus = allMenus.filter(menu => {
      return menu !== value
    })

    // remove the active class on any active menu
    otherMenus.forEach(menu => {
      el.querySelector(`#${menu}`).className = 'item'
    })

    // finally set the selected menu to active
    el.querySelector(`#${value}`).className = 'active item'
  }
}
