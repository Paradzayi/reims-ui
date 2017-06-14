const state = {
  clickedStand: {
    standid: null,
    status: null
  }
}

const mutations = {
  clickOnStand (state, payload) {
    if (payload.standid && payload.status) {
      state.clickedStand = payload
    }
  }
}

export default {
  state,
  mutations
}
