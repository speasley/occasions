import occasions, { getOccasion } from "./index"
import presets from "./presets"

// <script> tag build: exposes window.occasions(options), window.occasions.getOccasion(options)
// and window.occasions.presets
export default Object.assign(occasions, { getOccasion, presets })
