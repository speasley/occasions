import type { OccasionsOptions } from "./index"

export { occasions, getOccasion, OccasionsOptions } from "./index"

declare const Occasions: {
  install: (app: unknown, options?: OccasionsOptions) => void
}

export default Occasions
