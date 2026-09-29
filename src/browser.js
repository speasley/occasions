import occasions, { getOccasion } from "./index"

// <script> tag build: exposes window.occasions(options) and window.occasions.getOccasion(options)
export default Object.assign(occasions, { getOccasion })
