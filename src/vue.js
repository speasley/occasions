import occasions from "./index"

// Vue plugin: app.use(Occasions, options)
const Occasions = {
  install: (app, options) => {
    occasions(options)
  }
}

export { occasions, getOccasion } from "./index"
export default Occasions
